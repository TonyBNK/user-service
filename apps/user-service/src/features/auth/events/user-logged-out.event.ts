import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserLoggedOutEvent {
  constructor(public readonly userId: string) {}
}

@EventsHandler(UserLoggedOutEvent)
export class UserLoggedOutHandler implements IEventHandler<UserLoggedOutEvent> {
  private readonly logger = new Logger(UserLoggedOutHandler.name);

  handle({ userId }: UserLoggedOutEvent) {
    this.logger.log(`User with ID ${userId} logged out`);
  }
}
