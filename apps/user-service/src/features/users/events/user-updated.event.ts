import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserUpdatedEvent {
  constructor(public readonly id: string) {}
}

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedHandler implements IEventHandler<UserUpdatedEvent> {
  private readonly logger = new Logger(UserUpdatedHandler.name);

  handle({ id }: UserUpdatedEvent) {
    this.logger.log(`Updated user with ID ${id}`);
  }
}
