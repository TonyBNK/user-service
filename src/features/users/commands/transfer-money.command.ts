import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { MoneyService } from '../../../infrastructure/money/money.service';
import { TransferMoneyDto } from '../dto';
import { UserTransferredMoneyEvent } from '../events';

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
    private moneyService: MoneyService,
    private eventBus: EventBus,
  ) {}

  async execute({ userId, transferMoneyDto }: TransferMoneyCommand) {
    await this.moneyService.transferMoney({
      fromUserId: userId,
      toUserId: transferMoneyDto.toUserId,
      amount: transferMoneyDto.amount,
    });

    await this.eventBus.publish(new UserTransferredMoneyEvent(userId));
  }
}
