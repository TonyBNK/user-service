import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateImageDto } from './dto';
import { Image } from './image.entity';

@Injectable()
export class ImagesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createImage(imageDto: CreateImageDto): Promise<Image> {
    const image = Image.createInstance(imageDto);

    await this.dataSource.getRepository(Image).save(image);

    return image;
  }

  async deleteImage(id: string): Promise<boolean> {
    const result = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(Image)
      .where('id = :id', { id })
      .execute();

    return Boolean(result.affected);
  }
}
