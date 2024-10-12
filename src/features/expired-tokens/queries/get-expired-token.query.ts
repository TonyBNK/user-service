import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ExpiredToken } from '../expired-token.entity';
import { ExpiredTokensQueryRepository } from '../expired-tokens.query-repository';

export class GetExpiredTokenQuery {
  constructor(public readonly token: string) {}
}

@QueryHandler(GetExpiredTokenQuery)
export class GetExpiredTokenHandler
  implements IQueryHandler<GetExpiredTokenQuery>
{
  constructor(
    private expiredTokensQueryRepository: ExpiredTokensQueryRepository,
  ) {}

  async execute({ token }: GetExpiredTokenQuery): Promise<ExpiredToken | null> {
    return this.expiredTokensQueryRepository.getExpiredToken(token);
  }
}
