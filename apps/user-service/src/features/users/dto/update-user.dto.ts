import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PickType(CreateUserDto, [
  'password',
  'age',
  'biography',
] as const) {}
