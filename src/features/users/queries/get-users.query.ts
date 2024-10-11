import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SortDirection } from '../../../common/constants';
import { Paginator } from '../../../common/types';
import { GetUsersDto } from '../dto';
import { User } from '../user.entity';

export class GetUsersQuery {
  constructor(public readonly queryParams?: GetUsersDto) {}
}

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async execute({ queryParams }: GetUsersQuery): Promise<Paginator<User>> {
    return this.dataSource.transaction(async (manager) => {
      const searchLoginTerm = queryParams?.searchLoginTerm ?? '%';
      const sortBy = queryParams?.sortBy ?? 'createdAt';
      const sortDirection =
        queryParams?.sortDirection === SortDirection.asc ? 'ASC' : 'DESC';
      const pageNumber = Number(queryParams?.pageNumber) || 1;
      const pageSize = Number(queryParams?.pageSize) || 10;

      const totalCount = await manager
        .getRepository(User)
        .createQueryBuilder('u')
        .where('u.login ILIKE :loginTerm', {
          loginTerm: `%${searchLoginTerm}%`,
        })
        .orderBy(`u.${String(sortBy)}`, sortDirection)
        .getCount();

      const users = await manager
        .getRepository(User)
        .createQueryBuilder('u')
        .where('u.login ILIKE :loginTerm', {
          loginTerm: `%${searchLoginTerm}%`,
        })
        .orderBy(`u.${String(sortBy)}`, sortDirection)
        .take(pageSize)
        .skip((pageNumber - 1) * pageSize)
        .getMany();

      const pagesCount = Math.ceil(totalCount / pageSize);

      return {
        totalCount,
        pagesCount,
        page: pageNumber,
        pageSize,
        items: users,
      };
    });
  }
}
