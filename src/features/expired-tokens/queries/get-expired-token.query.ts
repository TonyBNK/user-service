import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ExpiredToken } from '../expired-token.entity';

export class GetExpiredTokenQuery {
  constructor(public readonly token: string) {}
}

@QueryHandler(GetExpiredTokenQuery)
export class GetExpiredTokenHandler
  implements IQueryHandler<GetExpiredTokenQuery>
{
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async execute({ token }: GetExpiredTokenQuery): Promise<ExpiredToken | null> {
    return this.dataSource
      .getRepository(ExpiredToken)
      .createQueryBuilder('et')
      .where('et.token = :token', { token })
      .getOne();
  }
}
