import { ApiProperty } from '@nestjs/swagger';

export class UserViewModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  login: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: 'integer' })
  age: number;

  @ApiProperty()
  biography: string;

  @ApiProperty({ type: () => Date })
  createdAt: string;
}

export const userViewModelKeys: Array<keyof UserViewModel> = [
  'id',
  'login',
  'email',
  'age',
  'biography',
  'createdAt',
];
