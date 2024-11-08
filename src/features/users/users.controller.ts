import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { User } from '../../common/decorators';
import { ApiPaginatorResponse } from '../../common/decorators/api-paginator-response.decorator';
import { AccessTokenGuard } from '../../common/guards';
import { ImageValidationPipe } from '../../common/pipes';
import { ErrorResult, Paginator } from '../../common/types';
import { ImageViewModel } from '../../common/types/view/image';
import { UserViewModel } from '../../common/types/view/user';
import { UploadFileDto } from '../../infrastructure/files/s3/dto';
import { mapPaginatorToViewModel } from '../../utils/mapPaginatorToViewModel';
import { mapUserToViewModel } from '../../utils/mapUserToViewModel';
import { GetImageByIdQuery } from '../images/queries';
import {
  CreateUserAvatarCommand,
  DeleteUserAvatarCommand,
  TransferMoneyCommand,
} from './commands';
import { GetUsersDto, TransferMoneyDto } from './dto';
import { GetUsersQuery } from './queries';

@Controller('users')
@UseGuards(AccessTokenGuard)
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

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

  @Post('images/avatar')
  @ApiOperation({
    summary:
      'Upload avatar for user (.png or .jpg (.jpeg) file (max size is 10MB))',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadFileDto,
  })
  @ApiCreatedResponse({
    description: 'Uploaded image information object',
    type: ImageViewModel,
  })
  @ApiBadRequestResponse({
    description: 'If file format is incorrect',
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
  @ApiForbiddenResponse({
    description: `If user try to upload avatar for another user`,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @User() user: { id: string },
    @UploadedFile(
      new ImageValidationPipe({
        fileType: ['image/png', 'image/jpg', 'image/jpeg'],
        maxSize: 10 * 1024 * 1024,
      }),
    )
    file: Express.Multer.File,
  ) {
    const avatarId = await this.commandBus.execute(
      new CreateUserAvatarCommand(user.id, file),
    );

    return this.queryBus.execute(new GetImageByIdQuery(avatarId));
  }

  @Delete('images/avatar/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: `Delete user's avatar`,
  })
  @ApiNoContentResponse({ description: 'No Content' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  async removeAvatar(@Param('id') avatarId: string) {
    await this.commandBus.execute(new DeleteUserAvatarCommand(avatarId));
  }

  @Post('transfer')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Transfer money to other user',
  })
  @ApiNoContentResponse({
    description: 'Money successfully transferred',
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
  @ApiUnprocessableEntityResponse({
    description: 'Not enough money to transfer',
  })
  async transferMoney(
    @User() user: { id: string },
    @Body() body: TransferMoneyDto,
  ) {
    await this.commandBus.execute(
      new TransferMoneyCommand(user.id, {
        toUserId: body.toUserId,
        amount: body.amount,
      }),
    );
  }
}
