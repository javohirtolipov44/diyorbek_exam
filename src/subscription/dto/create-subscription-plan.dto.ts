import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubscriptionPlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNumber()
  durationDays: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isActive?: boolean = true;
}
