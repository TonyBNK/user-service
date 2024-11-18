import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserTransferredMoneyEvent } from 'apps/user-service/src/features/users/events';
import { PaymentsService } from '../../../infrastructure/payments/payments.service';
import { TransferMoneyDto } from '../dto';

export class TransferMoneyCommand {
  constructor(
    public readonly userId: string,
    public readonly transferMoneyDto: TransferMoneyDto,
  ) {}
}

@CommandHandler(TransferMoneyCommand)
export class TransferMoneyHandler
  implements ICommandHandler<TransferMoneyCommand>
{
  constructor(
    private moneyService: PaymentsService,
    private eventBus: EventBus,
  ) {}

  async execute({
    userId,
    transferMoneyDto: { amount, toUserId },
  }: TransferMoneyCommand) {
    const transferMoneyDto = {
      fromUserId: userId,
      toUserId,
      amount,
    };

    await this.moneyService.transferMoney(transferMoneyDto);

    await this.eventBus.publish(
      new UserTransferredMoneyEvent(transferMoneyDto),
    );
  }
}
