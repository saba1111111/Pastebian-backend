import { Global, Module } from '@nestjs/common';
import { DatabaseProviders } from './providers';

@Global()
@Module({
  providers: [...DatabaseProviders],
  exports: [...DatabaseProviders],
})
export class DatabaseModule {}
