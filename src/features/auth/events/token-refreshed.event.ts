import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class TokenRefreshedEvent {
  constructor(public readonly userId: string) {}
}

@EventsHandler(TokenRefreshedEvent)
export class TokenRefreshedHandler
  implements IEventHandler<TokenRefreshedEvent>
{
  handle({ userId }: TokenRefreshedEvent) {
    console.log(`Tokens for user with ID ${userId} were updated`);
  }
}
