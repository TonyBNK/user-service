import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { TransferMoneyDto } from 'apps/user-service/src/infrastructure/payments/dto/transfer-money.dto';

export class UserTransferredMoneyEvent {
  constructor(public readonly transferMoneyDto: TransferMoneyDto) {}
}

@EventsHandler(UserTransferredMoneyEvent)
export class UserTransferredMoneyHandler
  implements IEventHandler<UserTransferredMoneyEvent>
{
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  async handle({ transferMoneyDto }: UserTransferredMoneyEvent) {
    this.natsClient.emit('transfer_notification', transferMoneyDto);
  }
}
