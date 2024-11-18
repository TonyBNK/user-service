import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserDeletedEvent {
  constructor(public readonly id: string) {}
}

@EventsHandler(UserDeletedEvent)
export class UserDeletedHandler implements IEventHandler<UserDeletedEvent> {
  private readonly logger = new Logger(UserDeletedHandler.name);

  handle({ id }: UserDeletedEvent) {
    this.logger.log(`User with ID ${id} was deleted`);
  }
}
