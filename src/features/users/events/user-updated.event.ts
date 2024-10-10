import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserUpdatedEvent {
  constructor(public readonly id: string) {}
}

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedHandler implements IEventHandler<UserUpdatedEvent> {
  handle({ id }: UserUpdatedEvent) {
    console.log(`Updated user with ID ${id}`);
  }
}
