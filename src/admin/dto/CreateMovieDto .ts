import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsEnum,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SubscriptionType } from '@prisma/client';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Type(() => Number)
  @IsNumber()
  release_year: number;

  @Type(() => Number)
  @IsNumber()
  duration_minutes: number;

  @IsEnum(SubscriptionType)
  subscription_type: SubscriptionType;

  @IsString()
  category_ids: string;
}
