import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserAvatarDeletedEvent {
  constructor(public readonly avatarId: string) {}
}

@EventsHandler(UserAvatarDeletedEvent)
export class UserAvatarDeletedHandler
  implements IEventHandler<UserAvatarDeletedEvent>
{
  handle({ avatarId }: UserAvatarDeletedEvent) {
    console.log(`Deleted avatar with ID ${avatarId}`);
  }
}
