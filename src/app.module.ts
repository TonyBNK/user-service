import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PostgresModule } from './database/postgres.module';
import FeaturesModule from './features';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    JwtModule.register({ global: true }),
    PostgresModule,
    FeaturesModule,
  ],
})
export class AppModule {}
