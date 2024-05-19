import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CallHandler, ExecutionContext, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Observable, tap } from 'rxjs';
import { IContent } from '../interfaces';
import { transformDateInMillisecondsInSeconds } from '../helpers';

export class ContentCacheInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;

    const cachedData: IContent = await this.cacheManager.get(id);
    if (cachedData) {
      return new Observable((observer) => {
        observer.next(cachedData);
        observer.complete();
      });
    }

    return next.handle().pipe(
      tap(async (data: IContent) => {
        await this.cacheManager.set(id, data, {
          ttl: transformDateInMillisecondsInSeconds(data.expireAt),
        });
      }),
    );
  }
}
