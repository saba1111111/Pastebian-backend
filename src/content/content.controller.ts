import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContentService } from 'libs/content';
import { ContentRoutes } from 'libs/content/constants';
import { CreateContentDto } from 'libs/content/dtos';
import { ContentEntity } from 'libs/content/entities';
import { ContentCacheInterceptor } from 'libs/content/interceptors';

@ApiTags(ContentRoutes.controller)
@Controller(ContentRoutes.controller)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @HttpCode(201)
  @ApiResponse({
    type: ContentEntity,
    status: 201,
  })
  public create(@Body() input: CreateContentDto): Promise<ContentEntity> {
    return this.contentService.create(input);
  }

  @Get(ContentRoutes.content_id)
  @UseInterceptors(ContentCacheInterceptor)
  @HttpCode(200)
  @ApiResponse({
    type: ContentEntity,
    status: 200,
  })
  public find(@Param('id') id: string): Promise<ContentEntity> {
    return this.contentService.findById(id);
  }

  @Delete(ContentRoutes.content_id)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
  })
  public delete(@Param('id') id: string): Promise<void> {
    return this.contentService.deleteById(id);
  }
}
