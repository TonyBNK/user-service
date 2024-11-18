import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserCreatedEvent {
  constructor(public readonly id: string) {}
}

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  private readonly logger = new Logger(UserCreatedHandler.name);

  handle({ id }: UserCreatedEvent) {
    this.logger.log(`Created user with ID ${id}`);
  }
}
