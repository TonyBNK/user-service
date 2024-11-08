import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasicStrategy } from '../../common/strategies';
import { FilesModule } from '../../infrastructure/files/files.module';
import { MoneyModule } from '../../infrastructure/money/money.module';
import { TokenModule } from '../../infrastructure/token/token.module';
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
    MoneyModule,
  ],
  controllers: [UsersController, UsersControllerSA],
  providers: [
    ...Services,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    BasicStrategy,
  ],
  exports: [...Services],
})
export class UsersModule {}
