import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  getCloudinary(): typeof cloudinary {
    return cloudinary;
  }

  async uploadFile(
    file: Express.Multer.File, 
    kind: 'image' | 'video'
  ): Promise<UploadApiResponse> {
    if (!file || !file.buffer) {
      throw new InternalServerErrorException('File buffer is missing or invalid.');
    }

    const resourceType = kind === 'video' ? 'video' : 'image';

    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'social-media/posts',
          resource_type: resourceType,
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            return reject(
              new InternalServerErrorException(`Cloudinary upload failed: ${error.message}`),
            );
          }
          if (!result) {
            return reject(
              new InternalServerErrorException('Cloudinary upload returned no response.'),
            );
          }
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}