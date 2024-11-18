import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '../user.entity';
import { UsersQueryRepository } from '../users.query-repository';

export class GetUserByLoginOrEmailQuery {
  constructor(public readonly loginOrEmail: string) {}
}

@QueryHandler(GetUserByLoginOrEmailQuery)
export class GetUserByLoginOrEmailHandler
  implements IQueryHandler<GetUserByLoginOrEmailQuery>
{
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute({
    loginOrEmail,
  }: GetUserByLoginOrEmailQuery): Promise<User | null> {
    return this.usersQueryRepository.getUserByLoginOrEmail(loginOrEmail);
  }
}
