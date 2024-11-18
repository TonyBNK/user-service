import { TokenService } from '@app/auth-lib/token';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { LoginUserDto } from '../dto';
import { UserLoggedInEvent } from '../events';

export class LoginUserCommand {
  constructor(public readonly loginUserDto: LoginUserDto) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    private eventBus: EventBus,
    private tokenService: TokenService,
  ) {}

  async execute({ loginUserDto: { userId, userLogin } }: LoginUserCommand) {
    const tokens = await this.tokenService.generateTokens(userId, userLogin);

    await this.eventBus.publish(new UserLoggedInEvent(userId));

    return tokens;
  }
}
