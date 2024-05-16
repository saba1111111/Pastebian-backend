import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContentService } from 'libs/content';
import { ContentRoutes } from 'libs/content/constants';
import { CreateContentDto } from 'libs/content/dtos';
import { ContentEntity } from 'libs/content/entities';

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
  @HttpCode(200)
  @ApiResponse({
    type: ContentEntity,
    status: 200,
  })
  public find(@Param('id') id: string): Promise<ContentEntity> {
    return this.contentService.find(id);
  }
}
