import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ExpiredToken } from './expired-token.entity';

@Injectable()
export class ExpiredTokensQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getExpiredToken(token: string): Promise<ExpiredToken | null> {
    return this.dataSource
      .getRepository(ExpiredToken)
      .createQueryBuilder('et')
      .where('et.token = :token', { token })
      .getOne();
  }
}
