import { CACHE_SERVICE_TOKEN } from '../constants';
import { RedisCacheService } from '../services/redis-cache.service';

export const CacheModuleProviders = [
  {
    provide: CACHE_SERVICE_TOKEN,
    useClass: RedisCacheService,
  },
];
