import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserByLoginOrEmailQuery } from '../features/users/queries';
import { ErrorResult } from '../types';

@Injectable()
export class EmailOrLoginExistGuard implements CanActivate {
  constructor(private queryBus: QueryBus) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const [userByEmail, userByLogin] = await Promise.all([
      this.queryBus.execute(new GetUserByLoginOrEmailQuery(request.body.email)),
      this.queryBus.execute(new GetUserByLoginOrEmailQuery(request.body.login)),
    ]);

    const errorResult: ErrorResult = {
      errorsMessages: [],
    };

    if (userByEmail) {
      errorResult.errorsMessages!.push({
        field: 'email',
        message: 'Such email already exists.',
      });
    }

    if (userByLogin) {
      errorResult.errorsMessages!.push({
        field: 'login',
        message: 'Such login already exists.',
      });
    }

    if (errorResult.errorsMessages!.length) {
      throw new BadRequestException(errorResult);
    }

    return true;
  }
}
