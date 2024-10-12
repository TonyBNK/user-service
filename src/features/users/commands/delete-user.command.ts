import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserDeletedEvent } from '../events';
import { UsersRepository } from '../users.repository';

export class DeleteUserCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private eventBus: EventBus,
  ) {}

  async execute({ id }: DeleteUserCommand): Promise<boolean> {
    const result = await this.usersRepository.deleteUser(id);

    await this.eventBus.publish(new UserDeletedEvent(id));

    return result;
  }
}
