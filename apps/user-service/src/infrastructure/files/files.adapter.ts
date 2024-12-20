import { UploadFileResponse } from '@app/types-lib';
import { UploadFileDto } from './s3/dto';

export abstract class IFileService {
  abstract uploadFile(dto: UploadFileDto): Promise<UploadFileResponse>;

  abstract removeFile(path: string): Promise<void>;
}
