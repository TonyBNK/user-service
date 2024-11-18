import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../users/dto';
import { UsersRepository } from '../../users/users.repository';
import { UserRegisteredEvent } from '../events';

export class RegisterUserCommand {
  constructor(public readonly userDto: CreateUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private eventBus: EventBus,
  ) {}

  async execute({ userDto }: RegisterUserCommand) {
    await this.usersRepository.createUser(userDto);

    await this.eventBus.publish(new UserRegisteredEvent(userDto.email));
  }
}
