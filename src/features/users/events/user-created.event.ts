import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserCreatedEvent {
  constructor(public readonly id: string) {}
}

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  handle({ id }: UserCreatedEvent) {
    console.log(`Created user with ID ${id}`);
  }
}
