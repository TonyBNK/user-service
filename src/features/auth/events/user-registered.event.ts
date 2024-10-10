import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserRegisteredEvent {
  constructor(public readonly email: string) {}
}

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler
  implements IEventHandler<UserRegisteredEvent>
{
  handle({ email }: UserRegisteredEvent) {
    console.log(`Account with email ${email} was registered`);
  }
}
