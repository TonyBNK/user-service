import { Cache } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SortDirection } from '../../common/constants';
import { GetUsersDto } from './dto';
import { User } from './user.entity';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly cacheManager: Cache,
  ) {}

  private generateCacheKey({
    searchLoginTerm,
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
  }: Omit<Required<GetUsersDto>, 'sortDirection'> & {
    sortDirection: 'ASC' | 'DESC';
  }): string {
    return `users:${searchLoginTerm || ''}:${sortBy || 'createdAt'}:${sortDirection || SortDirection.desc}:${pageNumber || 1}:${pageSize || 10}`;
  }

  async getUserById(id: string): Promise<User | null> {
    const cacheKey = `user:${id}`;
    const cachedUser = await this.cacheManager.get<User>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('u')
      .where('u.id = :id', { id })
      .getOne();

    if (user) {
      await this.cacheManager.set(cacheKey, user);
    }

    return user;
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
    const cacheKey = this.generateCacheKey({
      searchLoginTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    });

    const cachedData = await this.cacheManager.get<{
      users: Array<User>;
      totalCount: number;
    }>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const [users, totalCount] = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('u')
      .where('u.login ILIKE :loginTerm', {
        loginTerm: `%${searchLoginTerm}%`,
      })
      .orderBy(`u.${String(sortBy)}`, sortDirection)
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();

    await this.cacheManager.set(cacheKey, { totalCount, users });

    return { totalCount, users };
  }
}
