import { Module } from '@nestjs/common';
import { ContentService } from './services/content.service';
import { ContentModuleProviders } from './providers';

@Module({
  imports: [],
  providers: [ContentService, ...ContentModuleProviders],
  exports: [ContentService],
})
export class ContentLibModule {}
