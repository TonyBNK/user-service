import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { GetUserByLoginOrEmailQuery } from '../../features/users/queries';
import { User } from '../../features/users/user.entity';

@Injectable()
export class TokenService {
  constructor(
    private queryBus: QueryBus,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.queryBus.execute(
      new GetUserByLoginOrEmailQuery(loginOrEmail),
    );

    if (!user) {
      return null;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return null;
    }

    return user;
  }

  async generateTokens(userId: string, userLogin: string) {
    const secret = this.configService.get<string>('JWT_SECRET');

    const payload = {
      sub: userId,
      login: userLogin,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret,
        expiresIn: '10m',
      }),
      this.jwtService.signAsync(payload, {
        secret,
        expiresIn: '20d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }
}
