import { Test, TestingModule } from '@nestjs/testing';
import { ContentController } from './content.controller';
import { ContentService } from 'libs/content';
import { CreateContentDto } from 'libs/content/dtos';
import { ContentEntity } from 'libs/content/entities';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('ContentController', () => {
  let controller: ContentController;
  let service: ContentService;

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn(),
      findById: jest.fn(),
      deleteById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentController],
      providers: [
        {
          provide: ContentService,
          useValue: serviceMock,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ContentController>(ContentController);
    service = module.get<ContentService>(ContentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call contentService.create with the correct parameters', async () => {
      const input: CreateContentDto = {
        expireAt: new Date(),
        content: 'Mock Content',
      };

      const result: ContentEntity = {
        id: 'some-id',
        content: 'Mock Content',
        expireAt: input.expireAt.getTime(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      const response = await controller.create(input);

      expect(service.create).toHaveBeenCalledWith(input);
      expect(response).toEqual(result);
    });

    it('should handle errors correctly', async () => {
      const input: CreateContentDto = {
        expireAt: new Date(),
        content: 'Mock Content',
      };

      const error = new Error('Some error');
      jest.spyOn(service, 'create').mockRejectedValue(error);

      await expect(controller.create(input)).rejects.toThrow(error);
      expect(service.create).toHaveBeenCalledWith(input);
    });
  });

  describe('find', () => {
    it('should call contentService.findById with the correct parameter', async () => {
      const id = 'some-id';
      const result: ContentEntity = {
        id,
        content: 'Mock Content',
        expireAt: Date.now() + 3600000,
      };

      jest.spyOn(service, 'findById').mockResolvedValue(result);

      const response = await controller.find(id);

      expect(service.findById).toHaveBeenCalledWith(id);
      expect(response).toEqual(result);
    });

    it('should handle errors correctly', async () => {
      const id = 'some-id';
      const error = new Error('Some error');
      jest.spyOn(service, 'findById').mockRejectedValue(error);

      await expect(controller.find(id)).rejects.toThrow(error);
      expect(service.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('delete', () => {
    it('should call contentService.deleteById with the correct parameter', async () => {
      const id = 'some-id';
      jest.spyOn(service, 'deleteById').mockResolvedValue();

      await controller.delete(id);

      expect(service.deleteById).toHaveBeenCalledWith(id);
    });

    it('should handle errors correctly', async () => {
      const id = 'some-id';
      const error = new Error('Some error');
      jest.spyOn(service, 'deleteById').mockRejectedValue(error);

      await expect(controller.delete(id)).rejects.toThrow(error);
      expect(service.deleteById).toHaveBeenCalledWith(id);
    });
  });
});
