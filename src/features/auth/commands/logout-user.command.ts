import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TokenService } from '../../../infrastructure/token/token.service';
import { ExpiredToken } from '../../expired-tokens/expired-token.entity';
import { UserLoggedOutEvent } from '../events';

export class LogoutUserCommand {
  constructor(public readonly refreshToken: string) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private eventBus: EventBus,
    private tokenService: TokenService,
  ) {}

  async execute({ refreshToken }: LogoutUserCommand) {
    const { sub } = await this.tokenService.verifyToken(refreshToken);

    const expiredToken = ExpiredToken.createInstance({
      token: refreshToken,
    });

    await this.dataSource.getRepository(ExpiredToken).save(expiredToken);

    await this.eventBus.publish(new UserLoggedOutEvent(sub));
  }
}
