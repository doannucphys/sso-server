import { Global, Module } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import { ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { host, port, password, ttl } = configService.get('redis');
        const store = new KeyvRedis({
          socket: {
            host,
            port,
          },
          password,
        });
        return new Cacheable({
          // use in memory first then redis in second priority for better performance
          // secondary: store,

          // use redis as first priority for testing redis cache data deleting
          primary: store,
          ttl,
        });
      },
    },
    CacheService,
  ],
  exports: ['CACHE_INSTANCE', CacheService],
})
export class CacheModule {}
