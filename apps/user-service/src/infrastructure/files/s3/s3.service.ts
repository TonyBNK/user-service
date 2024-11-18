import { UploadFileResponse } from '@app/types-lib';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import { IFileService } from '../files.adapter';
import { UploadFileDto } from './dto';

@Injectable()
export class S3Service extends IFileService {
  s3Client: S3Client;
  bucketName: string;

  constructor(private readonly configService: ConfigService) {
    super();
    const s3Client = new S3Client({
      region: this.configService.get('REGION'),
      endpoint: this.configService.get('ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get('ACCESS_KEY') || '',
        secretAccessKey: this.configService.get('SECRET_ACCESS_KEY') || '',
      },
    });

    this.s3Client = s3Client;
    this.bucketName = this.configService.get('BUCKET') || '';
  }

  async uploadFile({
    folder,
    file,
  }: UploadFileDto): Promise<UploadFileResponse> {
    try {
      const metadata = await sharp(file.buffer).metadata();

      const path = `${folder}/${file.originalname}`;

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: path,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        }),
      );

      return {
        url: path,
        height: metadata.height || 0,
        width: metadata.width || 0,
        size: metadata.size || 0,
      };
    } catch (err) {
      throw new Error(`Unable to upload file: ${err.message}`);
    }
  }

  async removeFile(path: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: path,
        }),
      );
    } catch (err) {
      throw new Error(`Unable to remove file: ${err.message}`);
    }
  }
}
