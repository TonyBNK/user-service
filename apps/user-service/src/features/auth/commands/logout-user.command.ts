import { TokenService } from '@app/auth-lib/token';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ExpiredTokensRepository } from '../../expired-tokens/expired-tokens.repository';
import { UserLoggedOutEvent } from '../events';

export class LogoutUserCommand {
  constructor(public readonly refreshToken: string) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
  constructor(
    private expiredTokensRepository: ExpiredTokensRepository,
    private eventBus: EventBus,
    private tokenService: TokenService,
  ) {}

  async execute({ refreshToken }: LogoutUserCommand) {
    const { sub } = await this.tokenService.verifyToken(refreshToken);

    await this.expiredTokensRepository.createExpiredToken(refreshToken);

    await this.eventBus.publish(new UserLoggedOutEvent(sub));
  }
}
