import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class LoginViewModel {
  @IsString()
  @IsDefined()
  @ApiProperty({
    type: 'string',
    description: 'JWT access token',
  })
  accessToken: string;
}
