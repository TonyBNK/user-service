import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../../features/users/user.entity';
import { TransferMoneyDto } from './dto/transfer-money.dto';

@Injectable()
export class MoneyService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async transferMoney({ fromUserId, toUserId, amount }: TransferMoneyDto) {
    return this.dataSource.transaction('REPEATABLE READ', async (manager) => {
      const users = await manager
        .getRepository(User)
        .createQueryBuilder('u')
        .where('u.id IN (:...ids)', { ids: [fromUserId, toUserId] })
        .setLock('pessimistic_write')
        .getMany();

      const fromUser = users.find((user) => user.id === fromUserId);
      const toUser = users.find((user) => user.id === toUserId);

      if (!fromUser || !toUser) {
        throw new NotFoundException('Such user not found');
      }

      if (fromUser.balance < amount) {
        throw new UnprocessableEntityException('Not enough money to transfer');
      }

      await manager
        .createQueryBuilder()
        .update(User)
        .set({
          balance: () => `
      CASE 
        WHEN id = :fromUserId THEN balance - :amount
        WHEN id = :toUserId THEN balance + :amount
        ELSE balance
      END
    `,
        })
        .where('id IN (:...ids)', { ids: [fromUserId, toUserId] })
        .setParameters({ fromUserId, toUserId, amount })
        .execute();
    });
  }
}
