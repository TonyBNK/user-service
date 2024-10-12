import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GetUsersDto } from './dto';
import { User } from './user.entity';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getUserById(id: string): Promise<User | null> {
    return this.dataSource
      .getRepository(User)
      .createQueryBuilder('u')
      .where('u.id = :id', { id })
      .getOne();
  }

  async getUserByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    return this.dataSource
      .getRepository(User)
      .createQueryBuilder('u')
      .where('u.login = :login', {
        login: loginOrEmail,
      })
      .orWhere('u.email = :email', {
        email: loginOrEmail,
      })
      .getOne();
  }

  async getUsers({
    searchLoginTerm,
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
  }: Omit<Required<GetUsersDto>, 'sortDirection'> & {
    sortDirection: 'ASC' | 'DESC';
  }): Promise<{
    users: Array<User>;
    totalCount: number;
  }> {
    const [totalCount, users] = await Promise.all([
      this.dataSource
        .getRepository(User)
        .createQueryBuilder('u')
        .where('u.login ILIKE :loginTerm', {
          loginTerm: `%${searchLoginTerm}%`,
        })
        .orderBy(`u.${String(sortBy)}`, sortDirection)
        .getCount(),
      this.dataSource
        .getRepository(User)
        .createQueryBuilder('u')
        .where('u.login ILIKE :loginTerm', {
          loginTerm: `%${searchLoginTerm}%`,
        })
        .orderBy(`u.${String(sortBy)}`, sortDirection)
        .take(pageSize)
        .skip((pageNumber - 1) * pageSize)
        .getMany(),
    ]);

    return { totalCount, users };
  }
}
