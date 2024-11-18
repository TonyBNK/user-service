import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { ImageableEntity } from '../../common/constants';
import { CreateImageDto } from './dto';

@Entity({ name: 'images' })
export class Image {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column('uuid')
  entityId: string;

  @Column('jsonb')
  entityType: ImageableEntity;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  size: number;

  static createInstance({
    url,
    entityId,
    entityType,
    width,
    height,
    size,
  }: CreateImageDto): Image {
    const image = new Image();
    image.id = v4();
    image.url = url;
    image.entityId = entityId;
    image.entityType = entityType;
    image.width = width;
    image.height = height;
    image.size = size;

    return image;
  }
}
