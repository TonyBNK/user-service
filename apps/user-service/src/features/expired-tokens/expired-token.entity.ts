import { Entity, PrimaryColumn } from 'typeorm';
import { CreateExpiredTokenDto } from './dto';

@Entity({ name: 'expiredTokens' })
export class ExpiredToken {
  @PrimaryColumn()
  token: string;

  static createInstance({ token }: CreateExpiredTokenDto): ExpiredToken {
    const expiredToken = new ExpiredToken();
    expiredToken.token = token;

    return expiredToken;
  }
}
