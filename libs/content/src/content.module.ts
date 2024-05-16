import { Module } from '@nestjs/common';
import { ContentService } from './services/content.service';
import { ContentModuleProviders } from './providers';
import { CacheModule } from 'libs/cache';

@Module({
  imports: [CacheModule],
  providers: [ContentService, ...ContentModuleProviders],
  exports: [ContentService],
})
export class ContentLibModule {}
