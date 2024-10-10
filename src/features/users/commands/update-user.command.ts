import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UpdateUserDto } from '../dto';
import { UserUpdatedEvent } from '../events';
import { User } from '../user.entity';

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly userDto: UpdateUserDto,
  ) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private eventBus: EventBus,
  ) {}

  async execute({ id, userDto }: UpdateUserCommand): Promise<boolean> {
    const fieldsToUpdate = Object.fromEntries(
      Object.entries(userDto).filter(([, value]) => value),
    );

    const result = await this.dataSource
      .createQueryBuilder()
      .update(User)
      .set(fieldsToUpdate)
      .where('id = :id', { id })
      .execute();

    await this.eventBus.publish(new UserUpdatedEvent(id));

    return Boolean(result.affected);
  }
}
