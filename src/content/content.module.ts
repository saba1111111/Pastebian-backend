import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentLibModule } from 'libs/content';
import { ContentCacheInterceptor } from 'libs/content/interceptors';

@Module({
  imports: [ContentLibModule],
  controllers: [ContentController],
  providers: [ContentCacheInterceptor],
})
export class ContentModule {}
