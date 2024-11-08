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
      const [fromUser, toUser] = await Promise.all([
        manager
          .getRepository(User)
          .createQueryBuilder('u')
          .where('u.id = :id', { id: fromUserId })
          .setLock('pessimistic_write')
          .getOne(),
        manager
          .getRepository(User)
          .createQueryBuilder('u')
          .where('u.id = :id', { id: toUserId })
          .setLock('pessimistic_write')
          .getOne(),
      ]);

      if (!fromUser || !toUser) {
        throw new NotFoundException('Such user not found');
      }

      if (fromUser.balance < amount) {
        throw new UnprocessableEntityException('Not enough money to transfer');
      }

      await Promise.all([
        manager
          .createQueryBuilder()
          .update(User)
          .set({ balance: () => `balance - ${amount}` })
          .where('id = :id', { id: fromUserId })
          .execute(),
        manager
          .createQueryBuilder()
          .update(User)
          .set({ balance: () => `balance + ${amount}` })
          .where('id = :id', { id: toUserId })
          .execute(),
      ]);
    });
  }
}
