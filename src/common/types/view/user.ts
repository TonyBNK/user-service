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

  @ApiProperty({ type: 'float' })
  balance: number;

  @ApiProperty({ type: () => Date })
  createdAt: string;
}

export const userViewModelKeys: Array<keyof UserViewModel> = [
  'id',
  'login',
  'email',
  'age',
  'biography',
  'balance',
  'createdAt',
];
