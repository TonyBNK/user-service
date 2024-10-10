import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserDeletedEvent {
  constructor(public readonly id: string) {}
}

@EventsHandler(UserDeletedEvent)
export class UserDeletedHandler implements IEventHandler<UserDeletedEvent> {
  handle({ id }: UserDeletedEvent) {
    console.log(`User with ID ${id} was deleted`);
  }
}
