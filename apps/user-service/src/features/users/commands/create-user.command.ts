import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../dto';
import { UserCreatedEvent } from '../events';
import { UsersRepository } from '../users.repository';

export class CreateUserCommand {
  constructor(public readonly userDto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private eventBus: EventBus,
  ) {}

  async execute({ userDto }: CreateUserCommand): Promise<string> {
    const user = await this.usersRepository.createUser(userDto);

    await this.eventBus.publish(new UserCreatedEvent(user.id));

    return user.id;
  }
}
