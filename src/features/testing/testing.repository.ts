import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ExpiredToken } from '../expired-tokens/expired-token.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TestingRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async deleteAllData() {
    await Promise.all([
      this.dataSource.createQueryBuilder().delete().from(User).execute(),
      this.dataSource.createQueryBuilder().delete().from(Image).execute(),
      this.dataSource
        .createQueryBuilder()
        .delete()
        .from(ExpiredToken)
        .execute(),
    ]);
  }
}
