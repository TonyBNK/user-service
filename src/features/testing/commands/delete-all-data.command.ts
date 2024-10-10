import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TestingRepository } from '../testing.repository';

export class DeleteAllDataCommand {}

@CommandHandler(DeleteAllDataCommand)
export class DeleteAllDataHandler
  implements ICommandHandler<DeleteAllDataCommand>
{
  constructor(private testingRepo: TestingRepository) {}

  async execute() {
    return this.testingRepo.deleteAllData();
  }
}
