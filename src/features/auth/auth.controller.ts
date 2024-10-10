import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Cookies, User } from '../../decorators';
import {
  AccessTokenGuard,
  EmailOrLoginExistGuard,
  LoginGuard,
  RefreshTokenGuard,
} from '../../guards';
import { ErrorResult } from '../../types';
import { LoginViewModel } from '../../types/view/login';
import { MeViewModel } from '../../types/view/me';
import { mapMeToViewModel } from '../../utils/mapMeToViewModel';
import { CreateUserDto } from '../users/dto';
import { GetUserByIdQuery } from '../users/queries';
import {
  LoginUserCommand,
  LogoutUserCommand,
  RefreshTokenCommand,
  RegisterUserCommand,
} from './commands';
import { LoginInputDto } from './dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(EmailOrLoginExistGuard)
  @ApiOperation({
    summary: 'Registration in the system',
  })
  @ApiNoContentResponse({ description: 'Input data is accepted. User created' })
  @ApiBadRequestResponse({
    description:
      'If the inputModel has incorrect values (in particular if the user with the given email or login already exists)',
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
  async registerUser(@Body() createUserDto: CreateUserDto) {
    await this.commandBus.execute(new RegisterUserCommand(createUserDto));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LoginGuard)
  @ApiOperation({
    summary: 'Login user to the system',
  })
  @ApiBody({ required: true, type: LoginInputDto })
  @ApiOkResponse({
    description:
      'Returns JWT accessToken (expired after 10 minutes) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 minutes)',
    type: LoginViewModel,
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
    description: 'If the password or login is wrong',
  })
  async login(
    @User() user: { id: string; login: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.commandBus.execute(
      new LoginUserCommand({
        userId: user.id,
        userLogin: user.login,
      }),
    );

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return { accessToken };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({
    summary:
      'Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing)',
  })
  @ApiOkResponse({
    description:
      'Returns JWT accessToken (expired after 10 minutes) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 minutes)',
    type: LoginViewModel,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  async refreshToken(
    @Cookies('refreshToken') prevRefreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.commandBus.execute(
      new RefreshTokenCommand(prevRefreshToken),
    );

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return { accessToken };
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: 'Get information about current user',
  })
  @ApiOkResponse({
    description: 'Success',
    type: MeViewModel,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  async authMe(@User() user: { id: string; login: string }) {
    console.log('user: ', user);

    const userInfo = await this.queryBus.execute(new GetUserByIdQuery(user.id));

    return mapMeToViewModel(userInfo!);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({
    summary:
      'Logout user from the system. In cookie client must send correct refreshToken that will be revoked',
  })
  @ApiNoContentResponse({ description: 'No Content' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  async logout(@Cookies('refreshToken') refreshToken: string) {
    await this.commandBus.execute(new LogoutUserCommand(refreshToken));
  }
}
