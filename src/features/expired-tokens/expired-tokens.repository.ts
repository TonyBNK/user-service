import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ExpiredToken } from './expired-token.entity';

@Injectable()
export class ExpiredTokensRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createExpiredToken(refreshToken: string) {
    const expiredToken = ExpiredToken.createInstance({
      token: refreshToken,
    });

    await this.dataSource.getRepository(ExpiredToken).save(expiredToken);
  }
}
