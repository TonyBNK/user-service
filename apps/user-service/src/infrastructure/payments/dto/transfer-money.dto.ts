import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsUUID } from 'class-validator';

export class TransferMoneyDto {
  @IsUUID()
  @IsDefined()
  @ApiProperty({
    description: `Performs user sender ID`,
    type: 'string',
  })
  fromUserId: string;

  @IsUUID()
  @IsDefined()
  @ApiProperty({
    description: `Performs user receiver ID`,
    type: 'string',
  })
  toUserId: string;

  @IsNumber()
  @IsDefined()
  @ApiProperty({
    description: 'Performs the amount of transfer',
    type: 'float',
  })
  amount: number;
}
