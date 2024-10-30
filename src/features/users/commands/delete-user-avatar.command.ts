import { NotFoundException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { IFileService } from '../../../infrastructure/files/files.adapter';
import { ImagesQueryRepository } from '../../images/images.query-repository';
import { ImagesRepository } from '../../images/images.repository';
import { UserAvatarDeletedEvent } from '../events';

export class DeleteUserAvatarCommand {
  constructor(public readonly avatarId: string) {}
}

@CommandHandler(DeleteUserAvatarCommand)
export class DeleteUserAvatarHandler
  implements ICommandHandler<DeleteUserAvatarCommand>
{
  constructor(
    private imagesRepository: ImagesRepository,
    private imagesQueryRepository: ImagesQueryRepository,
    private fileService: IFileService,
    private eventBus: EventBus,
  ) {}

  async execute({ avatarId }: DeleteUserAvatarCommand): Promise<string> {
    const avatar = await this.imagesQueryRepository.getImageById(avatarId);

    if (!avatar) {
      throw new NotFoundException('Such avatar does not exist');
    }

    const path = avatar.url;

    await Promise.all([
      this.imagesRepository.deleteImage(avatarId),
      this.fileService.removeFile(path),
    ]);

    await this.eventBus.publish(new UserAvatarDeletedEvent(avatarId));

    return avatar.id;
  }
}
