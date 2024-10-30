import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import sharp from 'sharp';

type ImageValidationOptions = {
  fileType?: string | Array<string>;
  maxSize?: number;
  width?: number;
  height?: number;
};

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  constructor(private options?: ImageValidationOptions) {}

  async transform(value: Express.Multer.File) {
    if (!value) {
      throw new BadRequestException('Image file is required');
    }

    if (this.options) {
      const { fileType, maxSize, width, height } = this.options;

      if (fileType) {
        const isMultipleTypes = Array.isArray(fileType);

        const isTypeValid = isMultipleTypes
          ? fileType.reduce((acc, next) => {
              acc = acc || value.mimetype === next;
              return acc;
            }, false)
          : value.mimetype === fileType;

        if (!isTypeValid) {
          const formatMessage = isMultipleTypes
            ? fileType.join(', ')
            : fileType;

          throw new BadRequestException(
            `Only ${formatMessage} files are allowed`,
          );
        }
      }

      if (maxSize) {
        if (value.size > maxSize) {
          throw new BadRequestException(
            `File size should not exceed ${maxSize} bytes`,
          );
        }
      }

      const metadata = await sharp(value.buffer).metadata();

      if (width && metadata.width) {
        if (width !== metadata.width) {
          throw new BadRequestException(`Image width should be ${width}`);
        }
      }

      if (height && metadata.height) {
        if (height !== metadata.height) {
          throw new BadRequestException(`Image height should be ${height}`);
        }
      }
    }

    return value;
  }
}
