import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TokenService } from './token.service';

@Module({
  imports: [CqrsModule],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
