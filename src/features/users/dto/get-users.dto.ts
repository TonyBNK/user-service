import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { SortDirection } from '../../../common/constants';
import {
  UserViewModel,
  userViewModelKeys,
} from '../../../common/types/view/user';

export class GetUsersDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'string',
    description:
      'Search term for user Login: Login should contains this term in any position',
    default: null,
  })
  searchLoginTerm?: string | null;

  @IsIn(userViewModelKeys)
  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'string',
    default: 'createdAt',
  })
  sortBy?: keyof UserViewModel | null;

  @IsEnum(SortDirection)
  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'string',
    default: SortDirection.desc,
    enum: SortDirection,
  })
  sortDirection?: SortDirection;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'integer',
    description: 'pageNumber is number of portions that should be returned',
    default: 1,
  })
  pageNumber?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'integer',
    description: 'pageSize is portions size that should be returned',
    default: 10,
  })
  pageSize?: number;
}
