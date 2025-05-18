import { IsUUID } from 'class-validator';

export class CreateFavoriteDto {
  @IsUUID()
  movie_id: string;
}
