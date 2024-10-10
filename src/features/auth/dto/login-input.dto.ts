import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class LoginInputDto {
  @IsString()
  @IsDefined()
  @ApiProperty({
    type: 'string',
  })
  loginOrEmail: string;

  @IsString()
  @IsDefined()
  @ApiProperty({
    type: 'string',
  })
  password: string;
}
