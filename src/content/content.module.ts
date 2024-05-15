import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentLibModule } from 'libs/content';

@Module({
  imports: [ContentLibModule],
  controllers: [ContentController],
})
export class ContentModule {}
