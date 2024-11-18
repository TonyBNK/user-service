import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { GetUserByLoginOrEmailQuery } from 'apps/user-service/src/features/users/queries';
import { Strategy } from 'passport-local';

@Injectable()
export class LoginStrategy extends PassportStrategy(Strategy) {
  constructor(private queryBus: QueryBus) {
    super({ usernameField: 'loginOrEmail' });
  }

  async validate(
    loginOrEmail: string,
    password: string,
  ): Promise<{ id: string; login: string }> {
    const user = await this.queryBus.execute(
      new GetUserByLoginOrEmailQuery(loginOrEmail),
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordCorrect = await user.checkPassword(password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }

    return { id: user.id, login: user.login };
  }
}
