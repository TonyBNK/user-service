import { IsDefined, IsEnum, IsNumber, IsString } from 'class-validator';
import { ImageableEntity } from '../../../common/constants';

export class CreateImageDto {
  @IsString()
  @IsDefined()
  url: string;

  @IsString()
  @IsDefined()
  entityId: string;

  @IsEnum(ImageableEntity)
  @IsDefined()
  entityType: ImageableEntity;

  @IsNumber()
  @IsDefined()
  width: number;

  @IsNumber()
  @IsDefined()
  height: number;

  @IsNumber()
  @IsDefined()
  size: number;
}
