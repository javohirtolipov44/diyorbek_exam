import { VideoQuality } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class UploadMovieFileDto {
  @IsEnum(VideoQuality) quality: VideoQuality;
  @IsString() language: string;
}
