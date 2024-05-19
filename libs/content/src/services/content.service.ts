import { Inject, Injectable } from '@nestjs/common';
import { CONTENT_REPOSITORY_TOKEN } from '../constants';
import {
  IContent,
  IContentRepository,
  ICreateContentServiceCredentials,
  IIdentifyContentItem,
} from '../interfaces';
import { handleError } from 'libs/common/helpers';
import {
  ContentExpiredException,
  ContentNotFoundException,
  DeletionFailedException,
} from '../exceptions';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CacheStaticKeys } from 'libs/cache/constants';
import { ulid } from 'ulid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ContentService {
  constructor(
    @Inject(CONTENT_REPOSITORY_TOKEN)
    private readonly contentRepository: IContentRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async create(credentials: ICreateContentServiceCredentials) {
    const { expireAt, content } = credentials;

    try {
      const expireAtInMilliseconds = expireAt.getTime();

      return this.contentRepository.create({
        id: ulid(),
        content,
        expireAt: expireAtInMilliseconds,
      });
    } catch (error) {
      handleError(error);
    }
  }

  public async findById(id: string) {
    try {
      const content = await this.getItemOrThrow(id);

      if (content.expireAt <= Date.now()) {
        await this.contentRepository.deleteItem({
          id,
          expireAt: content.expireAt,
        });

        throw new ContentExpiredException(id);
      }

      return content;
    } catch (error) {
      handleError(error);
    }
  }

  public async deleteById(id: string) {
    try {
      const content = await this.getItemOrThrow(id);

      const numberOfItemsDeleted = await this.contentRepository.deleteItem({
        id,
        expireAt: content.expireAt,
      });

      if (numberOfItemsDeleted === 0) {
        throw new DeletionFailedException(id);
      }

      return;
    } catch (error) {
      handleError(error);
    }
  }

  public async getItemOrThrow(id: string): Promise<IContent> {
    const content = await this.contentRepository.findItemById(id);

    if (!content) {
      throw new ContentNotFoundException(id);
    }

    return content;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  public async deleteExpiredContentItems() {
    try {
      const { SCAN_ITEMS_NEXT_PAGE_TOKEN } = CacheStaticKeys;

      const nextPageToken = await this.cacheManager.get<string>(
        SCAN_ITEMS_NEXT_PAGE_TOKEN,
      );

      const expiredItemsData = await this.contentRepository.getExpiredItems({
        nextPageToken,
        fields: 'id, expireAt',
        Limit: 20,
      });

      if (expiredItemsData?.nextPageToken) {
        await this.cacheManager.set(
          SCAN_ITEMS_NEXT_PAGE_TOKEN,
          expiredItemsData.nextPageToken,
          60,
        );
      }

      if (expiredItemsData.items?.length) {
        const { unprocessedItems } = await this.contentRepository.deleteItems(
          expiredItemsData.items,
        );

        if (unprocessedItems.length) {
          await this.retryUnprocessedItemsWithExponentialBackoff(
            unprocessedItems,
          );
        }
      }
    } catch (error) {
      console.error(
        'Error when deleteExpiredContentItems cron job running.',
        error,
      );
    }
  }

  public async retryUnprocessedItemsWithExponentialBackoff(
    items: IIdentifyContentItem[],
    maxRetries = 5,
  ) {
    let attempts = 0;
    let unprocessedItems = items;

    try {
      while (unprocessedItems.length && attempts < maxRetries) {
        const result =
          await this.contentRepository.deleteItems(unprocessedItems);
        unprocessedItems = result.unprocessedItems;

        if (unprocessedItems.length) {
          attempts++;
          const delay = Math.pow(2, attempts) * 100;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    } catch (error) {
      console.error('Error during retrying unprocessed items.', error); // TODO (better error handling)
    }

    return unprocessedItems;
  }
}
