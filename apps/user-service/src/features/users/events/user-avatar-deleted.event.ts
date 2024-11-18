import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserAvatarDeletedEvent {
  constructor(public readonly avatarId: string) {}
}

@EventsHandler(UserAvatarDeletedEvent)
export class UserAvatarDeletedHandler
  implements IEventHandler<UserAvatarDeletedEvent>
{
  private readonly logger = new Logger(UserAvatarDeletedHandler.name);

  handle({ avatarId }: UserAvatarDeletedEvent) {
    this.logger.log(`Deleted avatar with ID ${avatarId}`);
  }
}
