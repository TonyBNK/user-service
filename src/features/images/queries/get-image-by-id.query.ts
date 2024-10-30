import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Image } from '../image.entity';
import { ImagesQueryRepository } from '../images.query-repository';

export class GetImageByIdQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetImageByIdQuery)
export class GetImageByIdHandler implements IQueryHandler<GetImageByIdQuery> {
  constructor(private imagesQueryRepository: ImagesQueryRepository) {}

  async execute({ id }: GetImageByIdQuery): Promise<Image | null> {
    return this.imagesQueryRepository.getImageById(id);
  }
}
