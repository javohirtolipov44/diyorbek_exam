import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: string, movieId: string) {
    const favorite = await this.prisma.favorite.create({
      data: {
        userId: userId,
        movieId: movieId,
      },
      include: {
        movie: true,
      },
    });
    return {
      success: true,
      data: {
        id: favorite.id,
        movie: {
          id: favorite.movie.id,
          title: favorite.movie.title,
          slug: favorite.movie.slug,
          poster_url: favorite.movie.posterUrl,
          release_year: favorite.movie.releaseYear,
          rating: favorite.movie.rating,
          subscription_type: favorite.movie.subscriptionType,
        },
      },
    };
  }
  async findAll(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId: userId },
      include: {
        movie: true,
      },
    });
    return {
      success: true,
      data: {
        movies: favorites.map((fav) => ({
          id: fav.movie.id,
          title: fav.movie.title,
          slug: fav.movie.slug,
          poster_url: fav.movie.posterUrl,
          release_year: fav.movie.releaseYear,
          rating: fav.movie.rating,
          subscription_type: fav.movie.subscriptionType,
        })),
        total: favorites.length,
      },
    };
  }
  async remove(id: string) {
    await this.prisma.favorite.delete({
      where: { id: id },
    });
    return {
      success: true,
      message: 'Favorite ochirildi',
    };
  }
}
