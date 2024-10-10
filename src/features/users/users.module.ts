import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from '../../infrastructure/token/token.module';
import { BasicStrategy } from '../../strategies';
import {
  CreateUserHandler,
  DeleteUserHandler,
  UpdateUserHandler,
} from './commands';
import {
  UserCreatedHandler,
  UserDeletedHandler,
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

const CommandHandlers = [
  CreateUserHandler,
  DeleteUserHandler,
  UpdateUserHandler,
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
];

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    TokenModule,
    CqrsModule,
  ],
  controllers: [UsersController, UsersControllerSA],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    BasicStrategy,
  ],
})
export class UsersModule {}
