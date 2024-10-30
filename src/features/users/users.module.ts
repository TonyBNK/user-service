import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasicStrategy } from '../../common/strategies';
import { FilesModule } from '../../infrastructure/files/files.module';
import { TokenModule } from '../../infrastructure/token/token.module';
import { ImagesModule } from '../images/images.module';
import {
  CreateUserHandler,
  DeleteUserHandler,
  UpdateUserHandler,
} from './commands';
import { CreateUserAvatarHandler } from './commands/create-user-avatar.command';
import { DeleteUserAvatarHandler } from './commands/delete-user-avatar.command';
import {
  UserAvatarCreatedHandler,
  UserAvatarDeletedHandler,
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
  CreateUserAvatarHandler,
  DeleteUserAvatarHandler,
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
