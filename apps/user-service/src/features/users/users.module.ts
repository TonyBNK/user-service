import { BasicStrategy } from '@app/auth-lib/strategies';
import { TokenModule } from '@app/auth-lib/token';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from 'apps/user-service/src/infrastructure/files/files.module';
import { PaymentsModule } from 'apps/user-service/src/infrastructure/payments/payments.module';
import { ImagesModule } from '../images/images.module';
import {
  CreateUserAvatarHandler,
  CreateUserHandler,
  DeleteUserAvatarHandler,
  DeleteUserHandler,
  TransferMoneyHandler,
  UpdateUserHandler,
} from './commands';
import {
  UserAvatarCreatedHandler,
  UserAvatarDeletedHandler,
  UserCreatedHandler,
  UserDeletedHandler,
  UserTransferredMoneyHandler,
  UserUpdatedHandler,
} from './events';
import {
  GetUserByIdHandler,
  GetUserByLoginOrEmailHandler,
  GetUsersHandler,
} from './queries';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersControllerSA } from './users.controller-sa';
import { UsersQueryRepository } from './users.query-repository';
import { UsersRepository } from './users.repository';

const CommandHandlers = [
  CreateUserHandler,
  DeleteUserHandler,
  UpdateUserHandler,
  CreateUserAvatarHandler,
  DeleteUserAvatarHandler,
  TransferMoneyHandler,
];
const QueryHandlers = [
  GetUsersHandler,
  GetUserByIdHandler,
  GetUserByLoginOrEmailHandler,
];
const EventHandlers = [
  UserCreatedHandler,
  UserDeletedHandler,
  UserUpdatedHandler,
  UserAvatarCreatedHandler,
  UserAvatarDeletedHandler,
  UserTransferredMoneyHandler,
];
const Services = [UsersRepository, UsersQueryRepository];

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    TokenModule,
    CqrsModule,
    FilesModule,
    ImagesModule,
    PaymentsModule,
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
  controllers: [UsersController, UsersControllerSA],
  providers: [
    ...Services,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    BasicStrategy,
  ],
  exports: [...Services, ClientsModule],
})
export class UsersModule {}
