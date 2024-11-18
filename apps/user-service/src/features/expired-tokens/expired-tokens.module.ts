import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpiredToken } from './expired-token.entity';
import { ExpiredTokensQueryRepository } from './expired-tokens.query-repository';
import { ExpiredTokensRepository } from './expired-tokens.repository';
import { GetExpiredTokenHandler } from './queries';

const QueryHandlers = [GetExpiredTokenHandler];
const Services = [ExpiredTokensRepository, ExpiredTokensQueryRepository];

@Module({
  imports: [TypeOrmModule.forFeature([ExpiredToken]), CqrsModule],
  providers: [...Services, ...QueryHandlers],
  exports: [...Services],
})
export class ExpiredTokensModule {}
