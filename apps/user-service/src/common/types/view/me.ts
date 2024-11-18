import { ApiProperty } from '@nestjs/swagger';

export class MeViewModel {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  login: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: 'integer' })
  age: number;

  @ApiProperty()
  biography: string;
}
