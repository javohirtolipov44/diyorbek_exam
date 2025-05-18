import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class MovieService {
  constructor(private readonly prisma: PrismaService) {}

  async getMovies(query: {
    page: number;
    limit: number;
    category?: string;
    search?: string;
    subscriptionType?: 'free' | 'premium';
  }) {
    const { page, limit, category, search, subscriptionType } = query;

    const where = {
      ...(category && {
        movieCategories: {
          some: {
            category: {
              name: {
                equals: category,
                mode: 'insensitive' as const,
              },
            },
          },
        },
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(subscriptionType && {
        subscriptionType: subscriptionType,
      }),
    };

    const movies = await this.prisma.movie.findMany({
      where,
      skip: 0,
      take: limit,
      include: {
        movieCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    return {
      success: true,
      data: { movies },
      page,
      limit,
      total: await this.prisma.movie.count({
        where,
      }),
    };
  }

  async getMovieBySlug(slug: string) {
    const movie = await this.prisma.movie.findUnique({
      where: {
        slug,
      },
      include: {
        movieCategories: true,
      },
    });

    return {
      success: true,
      data: movie,
    };
  }
}
