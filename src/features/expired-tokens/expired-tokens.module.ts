import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpiredToken } from './expired-token.entity';
import { GetExpiredTokenHandler } from './queries';

const QueryHandlers = [GetExpiredTokenHandler];

@Module({
  imports: [TypeOrmModule.forFeature([ExpiredToken]), CqrsModule],
  providers: [...QueryHandlers],
  exports: [],
})
export class ExpiredTokensModule {}
