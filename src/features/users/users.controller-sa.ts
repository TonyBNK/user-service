import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiPaginatorResponse } from '../../common/decorators/api-paginator-response.decorator';
import { BasicAuthGuard, UserExistsGuard } from '../../common/guards';
import { ErrorResult, Paginator } from '../../common/types';
import { UserViewModel } from '../../common/types/view/user';
import { mapPaginatorToViewModel } from '../../utils/mapPaginatorToViewModel';
import { mapUserToViewModel } from '../../utils/mapUserToViewModel';
import {
  CreateUserCommand,
  DeleteUserCommand,
  UpdateUserCommand,
} from './commands';
import { CreateUserDto, GetUsersDto, UpdateUserDto } from './dto';
import { GetUserByIdQuery, GetUsersQuery } from './queries';

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
@ApiTags('Users (Super Admin)')
@ApiBasicAuth()
export class UsersControllerSA {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Add new user to the system',
  })
  @ApiCreatedResponse({
    description: 'Returns the newly created user',
    type: UserViewModel,
  })
  @ApiBadRequestResponse({
    description: 'If the inputModel has incorrect values',
    type: ErrorResult,
    example: {
      errorsMessages: [
        {
          message: 'string',
          field: 'string',
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  async createUser(@Body() body: CreateUserDto): Promise<UserViewModel> {
    const userId = await this.commandBus.execute(new CreateUserCommand(body));

    const user = await this.queryBus.execute(new GetUserByIdQuery(userId));

    return mapUserToViewModel(user);
  }

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

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(UserExistsGuard)
  @ApiOperation({
    summary: 'Update user specified by id',
  })
  @ApiNoContentResponse({ description: 'No Content' })
  @ApiBadRequestResponse({
    description: 'If the inputModel has incorrect values',
    type: ErrorResult,
    example: {
      errorsMessages: [
        {
          message: 'string',
          field: 'string',
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    await this.commandBus.execute(new UpdateUserCommand(id, body));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete user specified by id',
  })
  @ApiNoContentResponse({ description: 'No Content' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  async deleteUser(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
