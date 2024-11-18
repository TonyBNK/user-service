import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsInt,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsDefined()
  @Length(3, 10)
  @Matches(new RegExp(/^[a-zA-Z0-9_-]*$/), {
    message: 'login can contain only letters, numbers _ and -',
  })
  @ApiProperty({
    description: `Performs user's login`,
    type: 'string',
    minimum: 3,
    maximum: 10,
  })
  login: string;

  @IsString()
  @IsDefined()
  @Matches(new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/), {
    message: 'email must be a valid email address',
  })
  @ApiProperty({
    description: `Performs user's email`,
    type: 'string',
  })
  email: string;

  @IsString()
  @IsDefined()
  @Length(6, 20)
  @ApiProperty({
    description: `Performs user's password`,
    type: 'string',
    minimum: 6,
    maximum: 20,
  })
  password: string;

  @IsInt()
  @IsDefined()
  @Min(1)
  @Max(100)
  @ApiProperty({
    description: 'Performs the age of user',
    type: 'integer',
    minimum: 1,
    maximum: 100,
  })
  age: number;

  @IsString()
  @IsDefined()
  @Length(1, 1000)
  @Matches(new RegExp(/^(?!\s).+(?<!\s)$/gm), {
    message: 'biography must contain symbols',
  })
  @ApiProperty({
    description: `Performs user's biography`,
    type: 'string',
    minimum: 1,
    maximum: 1000,
  })
  biography: string;
}
