import { Inject, Injectable } from '@nestjs/common';
import { CONTENT_REPOSITORY_TOKEN } from '../constants';
import {
  IContentRepository,
  ICreateContentServiceCredentials,
} from '../interfaces';
import { ulid } from 'ulid';
import { handleError } from 'libs/common/helpers';
import {
  ContentExpiredException,
  ContentNotFoundException,
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

  public async find(id: string) {
    try {
      const content = await this.contentRepository.findItem(id);
      if (!content) {
        throw new ContentNotFoundException(id);
      }

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
}
