import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ImageableEntity } from '../../common/constants';
import { Image } from './image.entity';

@Injectable()
export class ImagesQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getImageById(id: string): Promise<Image | null> {
    return this.dataSource
      .getRepository(Image)
      .createQueryBuilder('img')
      .where('img.id = :id', { id })
      .getOne();
  }

  async getEntityImages(
    entityId: string,
    entityType: ImageableEntity,
  ): Promise<Array<Image>> {
    return this.dataSource
      .getRepository(Image)
      .createQueryBuilder('img')
      .where('img.entityId = :entityId', { entityId })
      .andWhere('img.entityType = :entityType', { entityType })
      .getMany();
  }

  async getEntityImagesCount(
    entityId: string,
    entityType: ImageableEntity,
  ): Promise<number> {
    return this.dataSource
      .getRepository(Image)
      .createQueryBuilder('img')
      .where('img.entityId = :entityId', { entityId })
      .andWhere('img.entityType = :entityType', { entityType })
      .getCount();
  }
}
