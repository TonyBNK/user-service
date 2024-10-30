import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ExpiredTokensModule } from './expired-tokens/expired-tokens.module';
import { ImagesModule } from './images/images.module';
import { TestingModule } from './testing/testing.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ExpiredTokensModule,
    ImagesModule,
    TestingModule,
  ],
  exports: [
    AuthModule,
    UsersModule,
    ExpiredTokensModule,
    ImagesModule,
    TestingModule,
  ],
})
export default class FeaturesModule {}
