import { TokenModule } from '@app/auth-lib/token/token.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [TokenModule],
})
export class AuthLibModule {}
