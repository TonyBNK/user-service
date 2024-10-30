import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt, IsNumber, IsString } from 'class-validator';

export class ImageViewModel {
  @IsString()
  @IsDefined()
  @ApiProperty({
    type: 'string',
    description: 'image url',
  })
  url: string;

  @IsInt()
  @IsDefined()
  @ApiProperty({
    type: 'integer',
    description: 'image width',
  })
  width: number;

  @IsInt()
  @IsDefined()
  @ApiProperty({
    type: 'integer',
    description: 'image height',
  })
  height: number;

  @IsNumber()
  @IsDefined()
  @ApiProperty({
    type: 'number',
    description: 'image file size',
  })
  fileSize: number;
}
