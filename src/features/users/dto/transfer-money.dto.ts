import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsPositive, IsUUID, Min } from 'class-validator';

export class TransferMoneyDto {
  @IsUUID()
  @IsDefined()
  @ApiProperty({
    description: `Performs user receiver ID`,
    type: 'string',
  })
  toUserId: string;

  @IsNumber()
  @IsDefined()
  @Min(0)
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({
    description: 'Performs the amount of transfer',
    type: 'float',
    example: 1.01,
  })
  amount: number;
}
