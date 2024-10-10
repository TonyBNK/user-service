import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserDeletedEvent } from '../events';
import { User } from '../user.entity';

export class DeleteUserCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private eventBus: EventBus,
  ) {}

  async execute({ id }: DeleteUserCommand): Promise<boolean> {
    const result = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id })
      .execute();

    await this.eventBus.publish(new UserDeletedEvent(id));

    return Boolean(result.affected);
  }
}
