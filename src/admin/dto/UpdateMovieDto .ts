import { SubscriptionType } from '@prisma/client';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateMovieDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(SubscriptionType) subscription_type?: SubscriptionType;
  @IsOptional() @IsArray() category_ids?: string[];
}
