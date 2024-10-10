import { IsDefined, IsString, Length, Matches } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsDefined()
  userId: string;

  @IsString()
  @IsDefined()
  @Length(3, 10)
  @Matches(new RegExp(/^[a-zA-Z0-9_-]*$/), {
    message: 'login can contain only letters, numbers _ and -',
  })
  userLogin: string;
}
