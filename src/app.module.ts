import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'libs/database';
import { ContentModule } from './content/content.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheLibModule } from 'libs/cache';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheLibModule,
    ScheduleModule.forRoot(),
    DatabaseModule,
    ContentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
