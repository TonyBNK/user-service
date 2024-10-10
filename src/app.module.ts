import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PostgresModule } from './database/postgres.module';
import { AuthModule } from './features/auth/auth.module';
import { ExpiredTokensModule } from './features/expired-tokens/expired-tokens.module';
import { TestingModule } from './features/testing/testing.module';
import { UsersModule } from './features/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    JwtModule.register({ global: true }),
    PostgresModule,
    AuthModule,
    UsersModule,
    ExpiredTokensModule,
    TestingModule,
  ],
})
export class AppModule {}
