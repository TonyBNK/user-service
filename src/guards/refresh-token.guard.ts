import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetExpiredTokenQuery } from '../features/expired-tokens/queries';
import { TokenService } from '../infrastructure/token/token.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private queryBus: QueryBus,
    private tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Token is missing.');
    }

    try {
      await this.tokenService.verifyToken(refreshToken);
    } catch {
      throw new UnauthorizedException('Token expired.');
    }

    const expiredToken = await this.queryBus.execute(
      new GetExpiredTokenQuery(refreshToken),
    );

    if (expiredToken) {
      throw new UnauthorizedException('Token expired.');
    }

    return true;
  }
}
