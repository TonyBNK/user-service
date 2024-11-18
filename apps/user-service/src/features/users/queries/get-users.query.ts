import { Paginator } from '@app/types-lib';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SortDirection } from '../../../common/constants';
import { GetUsersDto } from '../dto';
import { User } from '../user.entity';
import { UsersQueryRepository } from '../users.query-repository';

export class GetUsersQuery {
  constructor(public readonly queryParams?: GetUsersDto) {}
}

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute({ queryParams }: GetUsersQuery): Promise<Paginator<User>> {
    const searchLoginTerm = queryParams?.searchLoginTerm ?? '%';
    const sortBy = queryParams?.sortBy ?? 'createdAt';
    const sortDirection =
      queryParams?.sortDirection === SortDirection.asc ? 'ASC' : 'DESC';
    const pageNumber = Number(queryParams?.pageNumber) || 1;
    const pageSize = Number(queryParams?.pageSize) || 10;

    const { totalCount, users } = await this.usersQueryRepository.getUsers({
      searchLoginTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    });

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      totalCount,
      pagesCount,
      page: pageNumber,
      pageSize,
      items: users,
    };
  }
}
