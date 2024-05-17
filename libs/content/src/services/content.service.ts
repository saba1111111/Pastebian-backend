import { Inject, Injectable } from '@nestjs/common';
import { CONTENT_REPOSITORY_TOKEN } from '../constants';
import {
  IContent,
  IContentRepository,
  ICreateContentServiceCredentials,
} from '../interfaces';
import { ulid } from 'ulid';
import { handleError } from 'libs/common/helpers';
import {
  ContentExpiredException,
  ContentNotFoundException,
  DeletionFailedException,
} from '../exceptions';

@Injectable()
export class ContentService {
  constructor(
    @Inject(CONTENT_REPOSITORY_TOKEN)
    private readonly contentRepository: IContentRepository,
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

  public deleteExpiredContentItems = async () => {
    try {
      // Check in cache nextPageToken.
      // Iterate over the items and find expired ones.
      const { items, nextPageToken } =
        await this.contentRepository.getExpiredItems();

      // With batch delete request delete expired items (retry mechanism with bull queue).

      return { items, nextPageToken };
    } catch (error) {
      //
    }
  };
}
