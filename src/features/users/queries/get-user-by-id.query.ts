import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';

export class GetUserByIdQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async execute({ id }: GetUserByIdQuery): Promise<User | null> {
    return this.dataSource.transaction(async (manager) => {
      return manager
        .getRepository(User)
        .createQueryBuilder('u')
        .where('u.id = :id', { id })
        .getOne();
    });
  }
}
