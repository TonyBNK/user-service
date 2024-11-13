import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

const options: CacheModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    store: redisStore,
    socket: {
      host: configService.get('REDIS_HOST'),
      port: Number(configService.get<number>('REDIS_PORT')),
    },
    password: configService.get('REDIS_PASSWORD'),
    ttl: Number(configService.get<number>('REDIS_TTL')),
  }),
  isGlobal: true,
};

@Module({
  imports: [CacheModule.registerAsync(options)],
})
export class RedisModule {}
