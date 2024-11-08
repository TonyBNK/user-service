import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserTransferredMoneyEvent {
  constructor(public readonly id: string) {}
}

@EventsHandler(UserTransferredMoneyEvent)
export class UserTransferredMoneyHandler
  implements IEventHandler<UserTransferredMoneyEvent>
{
  handle({ id }: UserTransferredMoneyEvent) {
    console.log(`User with ID ${id} transferred money`);
  }
}
