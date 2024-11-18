import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserAvatarCreatedEvent {
  constructor(public readonly userId: string) {}
}

@EventsHandler(UserAvatarCreatedEvent)
export class UserAvatarCreatedHandler
  implements IEventHandler<UserAvatarCreatedEvent>
{
  private readonly logger = new Logger(UserAvatarCreatedHandler.name);

  handle({ userId }: UserAvatarCreatedEvent) {
    this.logger.log(`Created avatar for user with ID ${userId}`);
  }
}
