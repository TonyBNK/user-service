import { TokenModule } from '@app/auth-lib/token';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationService } from 'apps/notification-service/src/notification.service';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';

const Services = [NotificationGateway, NotificationService];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    JwtModule.register({ global: true }),
    TokenModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'NATS_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            user: configService.get('NATS_USERNAME'),
            pass: configService.get('NATS_PASSWORD'),
            servers: [
              configService.get('NATS_SERVERS') || 'nats://localhost:4222',
            ],
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [...Services],
  exports: [ClientsModule],
})
export class NotificationModule {}
