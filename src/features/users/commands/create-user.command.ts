import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateUserDto } from '../dto';
import { UserCreatedEvent } from '../events';
import { User } from '../user.entity';

export class CreateUserCommand {
  constructor(public readonly userDto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private eventBus: EventBus,
  ) {}

  async execute({ userDto }: CreateUserCommand): Promise<string> {
    const user = await User.createInstance(userDto);

    await this.dataSource.getRepository(User).save(user);

    await this.eventBus.publish(new UserCreatedEvent(user.id));

    return user.id;
  }
}
