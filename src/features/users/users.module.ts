import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasicStrategy } from '../../common/strategies';
import { TokenModule } from '../../infrastructure/token/token.module';
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
import { UsersQueryRepository } from './users.query-repository';
import { UsersRepository } from './users.repository';

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
const Services = [UsersRepository, UsersQueryRepository];

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    TokenModule,
    CqrsModule,
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
