import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { TokenService } from '../infrastructure/token/token.service';

@Injectable()
export class LoginStrategy extends PassportStrategy(Strategy) {
  constructor(private tokenService: TokenService) {
    super({ usernameField: 'loginOrEmail' });
  }

  async validate(
    loginOrEmail: string,
    password: string,
  ): Promise<{ id: string; login: string }> {
    const user = await this.tokenService.validateUser(loginOrEmail, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return { id: user.id, login: user.login };
  }
}
