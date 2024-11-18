import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserDto } from '../dto';
import { UserUpdatedEvent } from '../events';
import { UsersRepository } from '../users.repository';

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly userDto: UpdateUserDto,
  ) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private eventBus: EventBus,
  ) {}

  async execute({ id, userDto }: UpdateUserCommand): Promise<boolean> {
    const result = await this.usersRepository.updateUser(id, userDto);

    await this.eventBus.publish(new UserUpdatedEvent(id));

    return result;
  }
}
