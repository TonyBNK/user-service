import { UnauthorizedException } from '@nestjs/common';

export class AccessTokenGuard {
  async validate(accessToken: string) {
    if (accessToken === 'valid-access-token') {
      return { id: 'user_id', login: 'user_login' };
    }

    throw new UnauthorizedException();
  }
}
