import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../features/users/queries';

@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(private queryBus: QueryBus) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const id = request.params.userId || request.params.id;

    const user = await this.queryBus.execute(new GetUserByIdQuery(id));

    if (!user) {
      throw new NotFoundException('Such user does not exist!');
    }

    return true;
  }
}
