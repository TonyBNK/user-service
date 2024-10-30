import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserAvatarCreatedEvent {
  constructor(public readonly userId: string) {}
}

@EventsHandler(UserAvatarCreatedEvent)
export class UserAvatarCreatedHandler
  implements IEventHandler<UserAvatarCreatedEvent>
{
  handle({ userId }: UserAvatarCreatedEvent) {
    console.log(`Created avatar for user with ID ${userId}`);
  }
}
