import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TokenService } from '../../../infrastructure/token/token.service';
import { ExpiredTokensRepository } from '../../expired-tokens/expired-tokens.repository';
import { TokenRefreshedEvent } from '../events';

export class RefreshTokenCommand {
  constructor(public readonly refreshToken: string) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private expiredTokensRepository: ExpiredTokensRepository,
    private eventBus: EventBus,
    private tokenService: TokenService,
  ) {}

  async execute({ refreshToken }: RefreshTokenCommand) {
    const { sub, login } = await this.tokenService.verifyToken(refreshToken);

    await this.expiredTokensRepository.createExpiredToken(refreshToken);

    const tokens = await this.tokenService.generateTokens(sub, login);

    await this.eventBus.publish(new TokenRefreshedEvent(sub));

    return tokens;
  }
}
