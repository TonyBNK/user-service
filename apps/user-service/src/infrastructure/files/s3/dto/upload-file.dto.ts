import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  readonly file: any;

  @IsString()
  @IsNotEmpty()
  readonly folder: string;
}
