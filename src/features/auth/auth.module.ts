import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, LoginStrategy } from '../../common/strategies';
import { TokenModule } from '../../infrastructure/token/token.module';
import { AuthController } from './auth.controller';
import {
  LoginUserHandler,
  LogoutUserHandler,
  RefreshTokenHandler,
  RegisterUserHandler,
} from './commands';
import {
  TokenRefreshedHandler,
  UserLoggedInHandler,
  UserLoggedOutHandler,
  UserRegisteredHandler,
} from './events';

const Services = [JwtService];
const CommandHandlers = [
  RegisterUserHandler,
  LoginUserHandler,
  RefreshTokenHandler,
  LogoutUserHandler,
];
const EventHandlers = [
  UserRegisteredHandler,
  UserLoggedInHandler,
  UserLoggedOutHandler,
  TokenRefreshedHandler,
];

@Module({
  imports: [PassportModule, CqrsModule, TokenModule],
  controllers: [AuthController],
  providers: [
    ...Services,
    ...CommandHandlers,
    ...EventHandlers,
    LoginStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
