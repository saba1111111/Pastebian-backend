import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from './content.service';
import { CONTENT_REPOSITORY_TOKEN } from '../constants';
import { IContentRepository } from '../interfaces';
import * as ulidLibrary from 'ulid';
import { UnexpectedErrorException } from 'libs/common/exceptions';

jest.mock('ulid');

describe('ContentService', () => {
  let service: ContentService;
  let repository: IContentRepository;
  let ulid: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: CONTENT_REPOSITORY_TOKEN,
          useValue: { create: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
    repository = module.get<IContentRepository>(CONTENT_REPOSITORY_TOKEN);
    ulid = ulidLibrary.ulid as jest.Mock;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create content method tests', () => {
    it('Should create content', async () => {
      const expireAt = new Date();
      const content = 'Mock Content';
      const id = 'da31';

      ulid.mockReturnValue(id);

      const expireAtInMilliseconds = expireAt.getTime();

      repository.create = jest.fn().mockResolvedValue({
        content,
        id,
        expireAt: expireAtInMilliseconds,
      });

      const result = await service.create({ expireAt, content });
      expect(repository.create).toHaveBeenCalledWith({
        id,
        content,
        expireAt: expireAtInMilliseconds,
      });
      expect(result).toEqual({
        id,
        content,
        expireAt: expireAtInMilliseconds,
      });
    });

    it('Should throw error when providing wrong expireAt argument', async () => {
      const expireAt = 'wrong Date' as unknown as Date;
      const content = 'Mock Content';

      expect(service.create({ expireAt, content })).rejects.toThrow(
        UnexpectedErrorException,
      );
    });
  });
});
