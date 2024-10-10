import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserLoggedInEvent {
  constructor(public readonly userId: string) {}
}

@EventsHandler(UserLoggedInEvent)
export class UserLoggedInHandler implements IEventHandler<UserLoggedInEvent> {
  handle({ userId }: UserLoggedInEvent) {
    console.log(`User with ID ${userId} logged in`);
  }
}
