import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserRegisteredEvent {
  constructor(public readonly email: string) {}
}

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler
  implements IEventHandler<UserRegisteredEvent>
{
  private readonly logger = new Logger(UserRegisteredHandler.name);

  handle({ email }: UserRegisteredEvent) {
    this.logger.log(`Account with email ${email} was registered`);
  }
}
