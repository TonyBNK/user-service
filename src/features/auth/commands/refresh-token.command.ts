import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TokenService } from '../../../infrastructure/token/token.service';
import { ExpiredToken } from '../../expired-tokens/expired-token.entity';
import { TokenRefreshedEvent } from '../events';

export class RefreshTokenCommand {
  constructor(public readonly refreshToken: string) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private eventBus: EventBus,
    private tokenService: TokenService,
  ) {}

  async execute({ refreshToken }: RefreshTokenCommand) {
    const { sub, login } = await this.tokenService.verifyToken(refreshToken);

    const expiredToken = ExpiredToken.createInstance({
      token: refreshToken,
    });

    await this.dataSource.getRepository(ExpiredToken).save(expiredToken);

    const tokens = await this.tokenService.generateTokens(sub, login);

    await this.eventBus.publish(new TokenRefreshedEvent(sub));

    return tokens;
  }
}
