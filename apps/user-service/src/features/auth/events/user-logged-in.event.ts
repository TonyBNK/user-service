import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserLoggedInEvent {
  constructor(public readonly userId: string) {}
}

@EventsHandler(UserLoggedInEvent)
export class UserLoggedInHandler implements IEventHandler<UserLoggedInEvent> {
  private readonly logger = new Logger(UserLoggedInHandler.name);

  handle({ userId }: UserLoggedInEvent) {
    this.logger.log(`User with ID ${userId} logged in`);
  }
}
