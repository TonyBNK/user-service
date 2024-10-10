import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';

export class GetUserByLoginOrEmailQuery {
  constructor(public readonly loginOrEmail: string) {}
}

@QueryHandler(GetUserByLoginOrEmailQuery)
export class GetUserByLoginOrEmailHandler
  implements IQueryHandler<GetUserByLoginOrEmailQuery>
{
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async execute({
    loginOrEmail,
  }: GetUserByLoginOrEmailQuery): Promise<User | null> {
    return this.dataSource.transaction(async (manager) => {
      return manager
        .getRepository(User)
        .createQueryBuilder('u')
        .where('u.login = :login', {
          login: loginOrEmail,
        })
        .orWhere('u.email = :email', {
          email: loginOrEmail,
        })
        .getOne();
    });
  }
}
