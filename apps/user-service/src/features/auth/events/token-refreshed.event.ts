import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class TokenRefreshedEvent {
  constructor(public readonly userId: string) {}
}

@EventsHandler(TokenRefreshedEvent)
export class TokenRefreshedHandler
  implements IEventHandler<TokenRefreshedEvent>
{
  private readonly logger = new Logger(TokenRefreshedHandler.name);

  handle({ userId }: TokenRefreshedEvent) {
    this.logger.log(`Tokens for user with ID ${userId} were updated`);
  }
}
