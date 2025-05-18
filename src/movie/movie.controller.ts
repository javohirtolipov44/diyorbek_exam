import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  getMovies(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('subscription_type') subscriptionType?: string,
  ) {
    return this.movieService.getMovies({
      page: +page,
      limit: +limit,
      category,
      search,
    });
  }

  @Get(':slug')
  getMovieBySlug(@Param('slug') slug: string) {
    return this.movieService.getMovieBySlug(slug);
  }
}
