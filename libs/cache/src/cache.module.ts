import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { ENVS } from 'libs/common/constants';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>(ENVS.REDIS_HOST),
        port: Number(configService.get<string>(ENVS.REDIS_PORT)),
      }),
    }),
  ],
  providers: [],
  exports: [CacheModule],
})
export class CacheLibModule {}
