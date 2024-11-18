import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { ImagesQueryRepository } from './images.query-repository';
import { ImagesRepository } from './images.repository';
import { GetImageByIdHandler } from './queries';

const QueryHandlers = [GetImageByIdHandler];
const Services = [ImagesRepository, ImagesQueryRepository];

@Module({
  imports: [TypeOrmModule.forFeature([Image]), CqrsModule],
  providers: [...Services, ...QueryHandlers],
  exports: [...Services],
})
export class ImagesModule {}
