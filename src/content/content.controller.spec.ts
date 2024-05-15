import { Test, TestingModule } from '@nestjs/testing';
import { ContentController } from './content.controller';
import { ContentService } from 'libs/content';
import { CreateContentDto } from 'libs/content/dtos';
import { ContentEntity } from 'libs/content/entities';

describe('ContentController', () => {
  let controller: ContentController;
  let service: ContentService;

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentController],
      providers: [
        {
          provide: ContentService,
          useValue: serviceMock,
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
});
