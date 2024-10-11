import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiPaginatorResponse } from '../../common/decorators/api-paginator-response.decorator';
import { AccessTokenGuard } from '../../common/guards';
import { Paginator } from '../../common/types';
import { UserViewModel } from '../../common/types/view/user';
import { mapPaginatorToViewModel } from '../../utils/mapPaginatorToViewModel';
import { mapUserToViewModel } from '../../utils/mapUserToViewModel';
import { GetUsersDto } from './dto';
import { GetUsersQuery } from './queries';

@Controller('users')
@UseGuards(AccessTokenGuard)
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  @ApiOperation({
    summary: 'Return all users',
  })
  @ApiPaginatorResponse(UserViewModel)
  @ApiBadRequestResponse({
    description: 'If the inputModel has incorrect values',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  async getUsers(
    @Query() query?: GetUsersDto,
  ): Promise<Paginator<UserViewModel>> {
    const users = await this.queryBus.execute(new GetUsersQuery(query));

    return mapPaginatorToViewModel(mapUserToViewModel)(users);
  }
}
