import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FieldError {
  @ApiProperty({
    type: 'string',
    nullable: true,
    description: 'Message with error explanation for certain field',
  })
  message: string | null;

  @ApiProperty({
    type: 'string',
    nullable: true,
    description: 'What field/property of input model has error',
  })
  field: string | null;
}

export class ErrorResult {
  @ApiProperty({ type: [FieldError], nullable: true })
  @Type(() => FieldError)
  errorsMessages: Array<FieldError> | null;
}

export class Paginator<T> {
  @ApiProperty({ required: true })
  items: Array<T>;

  @ApiProperty({ type: 'integer' })
  pagesCount: number;

  @ApiProperty({ type: 'integer' })
  page: number;

  @ApiProperty({ type: 'integer' })
  pageSize: number;

  @ApiProperty({ type: 'integer' })
  totalCount: number;
}

export type UploadFileResponse = {
  url: string;
  width: number;
  height: number;
  size: number;
};
