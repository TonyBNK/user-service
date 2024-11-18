import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteAllDataCommand } from './commands';

@ApiTags('Testing')
@Controller('testing')
export class TestingController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Clear database: delete all data from all tables',
  })
  @ApiNoContentResponse({ description: 'All data is deleted' })
  async deleteAllData() {
    await this.commandBus.execute(new DeleteAllDataCommand());
  }
}
