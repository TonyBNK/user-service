import { ForbiddenException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ImageableEntity } from '../../../common/constants';
import { IFileService } from '../../../infrastructure/files/files.adapter';
import { ImagesQueryRepository } from '../../images/images.query-repository';
import { ImagesRepository } from '../../images/images.repository';
import { UserAvatarCreatedEvent } from '../events';

export class CreateUserAvatarCommand {
  constructor(
    public readonly userId: string,
    public readonly file: Express.Multer.File,
  ) {}
}

@CommandHandler(CreateUserAvatarCommand)
export class CreateUserAvatarHandler
  implements ICommandHandler<CreateUserAvatarCommand>
{
  constructor(
    private imagesRepository: ImagesRepository,
    private imagesQueryRepository: ImagesQueryRepository,
    private fileService: IFileService,
    private eventBus: EventBus,
  ) {}

  async execute({ userId, file }: CreateUserAvatarCommand): Promise<string> {
    const avatarsCount = await this.imagesQueryRepository.getEntityImagesCount(
      userId,
      ImageableEntity.User,
    );

    if (avatarsCount >= 5) {
      throw new ForbiddenException('Too many avatars');
    }

    const folder = `files/users/${userId}/avatar`;

    const { url, height, size, width } = await this.fileService.uploadFile({
      folder,
      file,
    });

    const avatar = await this.imagesRepository.createImage({
      url,
      entityId: userId,
      entityType: ImageableEntity.User,
      width,
      height,
      size,
    });

    await this.eventBus.publish(new UserAvatarCreatedEvent(userId));

    return avatar.id;
  }
}
