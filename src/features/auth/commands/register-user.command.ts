import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateUserDto } from '../../users/dto';
import { User } from '../../users/user.entity';
import { UserRegisteredEvent } from '../events';

export class RegisterUserCommand {
  constructor(public readonly userDto: CreateUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private eventBus: EventBus,
  ) {}

  async execute({
    userDto: { email, login, password, age, biography },
  }: RegisterUserCommand) {
    const user = await User.createInstance({
      email,
      login,
      password,
      age,
      biography,
    });

    await this.dataSource.getRepository(User).save(user);

    await this.eventBus.publish(new UserRegisteredEvent(email));
  }
}
