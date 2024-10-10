import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteAllDataHandler } from './commands';
import { TestingController } from './testing.controller';
import { TestingRepository } from './testing.repository';

const Services = [TestingRepository];
const CommandHandlers = [DeleteAllDataHandler];

@Module({
  imports: [CqrsModule],
  controllers: [TestingController],
  providers: [...Services, ...CommandHandlers],
  exports: [...Services],
})
export class TestingModule {}
