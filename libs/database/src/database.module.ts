import { Module } from '@nestjs/common';
import { DatabaseProviders } from './providers';

@Module({
  providers: [...DatabaseProviders],
  exports: [...DatabaseProviders],
})
export class DatabaseModule {}
