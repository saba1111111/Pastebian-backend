import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from './content.service';
import { CONTENT_REPOSITORY_TOKEN } from '../constants';
import { IContentRepository } from '../interfaces';
import * as ulidLibrary from 'ulid';
import { UnexpectedErrorException } from 'libs/common/exceptions';
import {
  ContentExpiredException,
  ContentNotFoundException,
  DeletionFailedException,
} from '../exceptions';
import { CacheStaticKeys } from 'libs/cache/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

jest.mock('ulid');

describe('ContentService', () => {
  let service: ContentService;
  let repository: IContentRepository;
  let ulid: jest.Mock;
  let cacheService: Cache;

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
            deleteItems: jest.fn(),
            getExpiredItems: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
    repository = module.get<IContentRepository>(CONTENT_REPOSITORY_TOKEN);
    ulid = ulidLibrary.ulid as jest.Mock;
    cacheService = module.get<Cache>(CACHE_MANAGER);
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

  describe('getItemOrThrow method tests', () => {
    it('should return the content item if it exists', async () => {
      const id = Math.random().toString();
      const content = {
        id,
        content: 'Mock Content',
        expireAt: Date.now() + 3600000,
      };

      jest.spyOn(repository, 'findItemById').mockResolvedValue(content);

      const result = await service.getItemOrThrow(id);

      expect(repository.findItemById).toHaveBeenCalledWith(id);
      expect(result).toEqual(content);
    });

    it('should throw ContentNotFoundException if content does not exist', async () => {
      const id = 'non-existent-id';

      jest.spyOn(repository, 'findItemById').mockResolvedValue(null);

      await expect(service.getItemOrThrow(id)).rejects.toThrow(
        ContentNotFoundException,
      );

      expect(repository.findItemById).toHaveBeenCalledWith(id);
    });
  });

  describe('deleteById method tests', () => {
    it('should delete the content item if it exists and deletion is successful', async () => {
      const id = Math.random().toString();
      const content = {
        id,
        content: 'Mock Content',
        expireAt: Date.now() + 3600000,
      };

      jest.spyOn(service, 'getItemOrThrow').mockResolvedValue(content);
      jest.spyOn(repository, 'deleteItem').mockResolvedValue(1);

      await expect(service.deleteById(id)).resolves.toBeUndefined();

      expect(service.getItemOrThrow).toHaveBeenCalledWith(id);
      expect(repository.deleteItem).toHaveBeenCalledWith({
        id,
        expireAt: content.expireAt,
      });
    });

    it('should throw DeletionFailedException if no items were deleted', async () => {
      const id = Math.random().toString();
      const content = {
        id,
        content: 'Mock Content',
        expireAt: Date.now() + 3600000,
      };

      jest.spyOn(service, 'getItemOrThrow').mockResolvedValue(content);
      jest.spyOn(repository, 'deleteItem').mockResolvedValue(0);

      await expect(service.deleteById(id)).rejects.toThrow(
        DeletionFailedException,
      );

      expect(service.getItemOrThrow).toHaveBeenCalledWith(id);
      expect(repository.deleteItem).toHaveBeenCalledWith({
        id,
        expireAt: content.expireAt,
      });
    });

    it('should handle errors correctly', async () => {
      const id = 'some-id';
      const error = new Error('Some error');

      jest.spyOn(service, 'getItemOrThrow').mockRejectedValue(error);

      await expect(service.deleteById(id)).rejects.toThrow(
        UnexpectedErrorException,
      );

      expect(service.getItemOrThrow).toHaveBeenCalledWith(id);
      expect(repository.deleteItem).not.toHaveBeenCalled();
    });
  });

  describe('retryUnprocessedItemsWithExponentialBackoff method tests', () => {
    it('Should retry and return the same list of unprocessed items.', async () => {
      const unprocessedItems = [
        { id: Math.random().toString(), expireAt: Date.now() + 3600000 },
      ];
      const maxRetries = 3;

      repository.deleteItems = jest
        .fn()
        .mockResolvedValue({ unprocessedItems });

      const result = await service.retryUnprocessedItemsWithExponentialBackoff(
        unprocessedItems,
        maxRetries,
      );

      expect(repository.deleteItems).toHaveBeenCalledTimes(maxRetries);
      expect(result).toEqual(unprocessedItems);
    });

    it('Should retry once and return empty list of unprocessed items.', async () => {
      const unprocessedItems = [
        { id: Math.random().toString(), expireAt: Date.now() + 3600000 },
      ];
      repository.deleteItems = jest
        .fn()
        .mockResolvedValue({ unprocessedItems: [] });

      const result =
        await service.retryUnprocessedItemsWithExponentialBackoff(
          unprocessedItems,
        );

      expect(repository.deleteItems).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('Should retry twice and return empty list of unprocessed items.', async () => {
      const unprocessedItems = [
        { id: Math.random().toString(), expireAt: Date.now() + 3600000 },
      ];
      repository.deleteItems = jest
        .fn()
        .mockResolvedValueOnce({ unprocessedItems: unprocessedItems })
        .mockResolvedValueOnce({ unprocessedItems: [] });

      const result =
        await service.retryUnprocessedItemsWithExponentialBackoff(
          unprocessedItems,
        );

      expect(repository.deleteItems).toHaveBeenCalledTimes(2);
      expect(result).toEqual([]);
    });

    it('Should return empty list of unprocessed items immediately.', async () => {
      const unprocessedItems = [];
      repository.deleteItems = jest
        .fn()
        .mockResolvedValueOnce({ unprocessedItems });

      const result =
        await service.retryUnprocessedItemsWithExponentialBackoff(
          unprocessedItems,
        );

      expect(repository.deleteItems).toHaveBeenCalledTimes(0);
      expect(result).toEqual([]);
    });

    it('Should handle errors from deleteItems and return the reminding unprocessedItems.', async () => {
      const unprocessedItems = [
        { id: Math.random().toString(), expireAt: Date.now() + 3600000 },
      ];

      repository.deleteItems = jest
        .fn()
        .mockRejectedValue(new Error('Test error'));

      const result =
        await service.retryUnprocessedItemsWithExponentialBackoff(
          unprocessedItems,
        );

      expect(result).toEqual(unprocessedItems);
      expect(repository.deleteItems).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteExpiredContentItems method tests', () => {
    it('should process expired items.', async () => {
      const expiredItems = [
        { id: 'item1', expireAt: Date.now() - 3600000 },
        { id: 'item2', expireAt: Date.now() - 3600000 },
      ];
      const nextPageToken = 'someToken';

      (cacheService.get as jest.Mock).mockResolvedValue(nextPageToken);
      (repository.getExpiredItems as jest.Mock).mockResolvedValue({
        items: expiredItems,
        nextPageToken: 'newToken',
      });
      (repository.deleteItems as jest.Mock).mockResolvedValue({
        unprocessedItems: [],
      });

      const retryMock = jest
        .spyOn(service, 'retryUnprocessedItemsWithExponentialBackoff')
        .mockResolvedValue([]);

      await service.deleteExpiredContentItems();

      expect(cacheService.get).toHaveBeenCalledWith(
        CacheStaticKeys.SCAN_ITEMS_NEXT_PAGE_TOKEN,
      );
      expect(repository.getExpiredItems).toHaveBeenCalledWith({
        nextPageToken,
        fields: 'id, expireAt',
        Limit: 20,
      });
      expect(cacheService.set).toHaveBeenCalledWith(
        CacheStaticKeys.SCAN_ITEMS_NEXT_PAGE_TOKEN,
        'newToken',
        60,
      );
      expect(repository.deleteItems).toHaveBeenCalledWith(expiredItems);
      expect(retryMock).not.toHaveBeenCalled();
    });

    it('should handle unprocessed items with exponential backoff', async () => {
      const expiredItems = [
        { id: 'item1', expireAt: Date.now() - 3600000 },
        { id: 'item2', expireAt: Date.now() - 3600000 },
      ];
      const nextPageToken = 'someToken';

      (cacheService.get as jest.Mock).mockResolvedValue(nextPageToken);
      (repository.getExpiredItems as jest.Mock).mockResolvedValue({
        items: expiredItems,
        nextPageToken: 'newToken',
      });
      (repository.deleteItems as jest.Mock).mockResolvedValue({
        unprocessedItems: expiredItems,
      });

      const retryMock = jest
        .spyOn(service, 'retryUnprocessedItemsWithExponentialBackoff')
        .mockResolvedValue([]);

      await service.deleteExpiredContentItems();

      expect(cacheService.get).toHaveBeenCalledWith(
        CacheStaticKeys.SCAN_ITEMS_NEXT_PAGE_TOKEN,
      );
      expect(repository.getExpiredItems).toHaveBeenCalledWith({
        nextPageToken,
        fields: 'id, expireAt',
        Limit: 20,
      });
      expect(cacheService.set).toHaveBeenCalledWith(
        CacheStaticKeys.SCAN_ITEMS_NEXT_PAGE_TOKEN,
        'newToken',
        60,
      );
      expect(repository.deleteItems).toHaveBeenCalledWith(expiredItems);
      expect(retryMock).toHaveBeenCalledWith(expiredItems);
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Test error');

      (repository.getExpiredItems as jest.Mock).mockRejectedValue(error);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await service.deleteExpiredContentItems();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error when deleteExpiredContentItems cron job running.',
        error,
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('invalidateCacheAfterDeleteItem method tests', () => {
    it('should invalidate the cache if the key exists', async () => {
      const key = 'existing-key';

      (cacheService.del as jest.Mock).mockResolvedValue(true);

      const result = await service.invalidateCacheAfterDeleteItem(key);

      expect(cacheService.del).toHaveBeenCalledWith(key);
      expect(result).toBe(true);
    });

    it('should return false if the key does not exist', async () => {
      const key = 'non-existing-key';

      (cacheService.del as jest.Mock).mockResolvedValue(false);

      const result = await service.invalidateCacheAfterDeleteItem(key);

      expect(cacheService.del).toHaveBeenCalledWith(key);
      expect(result).toBe(true);
    });

    it('should handle errors gracefully and return false', async () => {
      const key = 'key-with-error';

      (cacheService.del as jest.Mock).mockRejectedValue(
        new Error('Test error'),
      );

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.invalidateCacheAfterDeleteItem(key);

      expect(cacheService.del).toHaveBeenCalledWith(key);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Failed to invalidate cache for key ${key}:`,
        expect.any(Error),
      );
      expect(result).toBe(false);

      consoleErrorSpy.mockRestore();
    });
  });
});
