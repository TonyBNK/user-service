import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserLoggedOutEvent {
  constructor(public readonly userId: string) {}
}

@EventsHandler(UserLoggedOutEvent)
export class UserLoggedOutHandler implements IEventHandler<UserLoggedOutEvent> {
  handle({ userId }: UserLoggedOutEvent) {
    console.log(`User with ID ${userId} logged out`);
  }
}
