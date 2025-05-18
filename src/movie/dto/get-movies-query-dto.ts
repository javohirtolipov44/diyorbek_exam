import { IsOptional, IsIn, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMoviesQueryDto {
  @IsOptional()
  @IsIn(['free', 'premium'])
  subscriptionType?: 'free' | 'premium';

  @IsOptional()
  category?: string;

  @IsOptional()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
