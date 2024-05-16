import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from './content.service';
import { CONTENT_REPOSITORY_TOKEN } from '../constants';
import { IContentRepository } from '../interfaces';
import * as ulidLibrary from 'ulid';
import { UnexpectedErrorException } from 'libs/common/exceptions';
import {
  ContentExpiredException,
  ContentNotFoundException,
} from '../exceptions';

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
          useValue: {
            create: jest.fn(),
            findItemById: jest.fn(),
            deleteItem: jest.fn(),
          },
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
      const id = Math.random().toString();

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

  describe('find content by id method tests.', () => {
    it('Should find content item.', async () => {
      const id = Math.random().toString();
      const content = 'Mock Content.';
      const expireAt = Date.now() + 3600000;

      repository.findItemById = jest.fn().mockResolvedValue({
        content,
        id,
        expireAt,
      });

      const result = await service.findById(id);

      expect(repository.findItemById).toHaveBeenCalledWith(id);
      expect(result).toEqual({ id, content, expireAt });
    });

    it('Should throw ContentNotFoundException when content is not found', async () => {
      const id = Math.random().toString();

      repository.findItemById = jest.fn().mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(
        ContentNotFoundException,
      );

      expect(repository.findItemById).toHaveBeenCalledWith(id);
    });

    it('Should delete expired content and throw ContentExpiredException', async () => {
      const id = Math.random().toString();
      const content = 'Mock Content';
      const expireAt = Date.now() - 3600000;

      repository.findItemById = jest.fn().mockResolvedValue({
        content,
        id,
        expireAt,
      });
      repository.deleteItem = jest.fn().mockResolvedValue(1);

      await expect(service.findById(id)).rejects.toThrow(
        ContentExpiredException,
      );

      expect(repository.findItemById).toHaveBeenCalledWith(id);
      expect(repository.deleteItem).toHaveBeenCalledWith({ id, expireAt });
    });
  });
});
