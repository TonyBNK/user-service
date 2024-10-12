import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '../user.entity';
import { UsersQueryRepository } from '../users.query-repository';

export class GetUserByIdQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute({ id }: GetUserByIdQuery): Promise<User | null> {
    return this.usersQueryRepository.getUserById(id);
  }
}
