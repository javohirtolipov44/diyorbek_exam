import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import slugify from 'slugify';

import { CreateMovieDto } from './dto/CreateMovieDto ';
import { UpdateMovieDto } from './dto/UpdateMovieDto ';
import { UploadMovieFileDto } from './dto/UploadMovieFileDto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateMovieDto,
    file: Express.Multer.File,
    adminId: string,
  ) {
    const slug = slugify(dto.title, { lower: true });

    const movie = await this.prisma.movie.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        releaseYear: dto.release_year,
        subscriptionType: dto.subscription_type,
        viewCount: 0,
        posterUrl: file.filename,
        durationMinutes: dto.duration_minutes,
        createdBy: adminId,
      },
    });

    return {
      success: true,
      message: "Yangi kino muvaffaqiyatli qo'shildi",
      data: {
        id: movie.id,
        title: movie.title,
        slug: movie.slug,
        created_at: movie.createdAt,
      },
    };
  }

  async findAll() {
    const movies = await this.prisma.movie.findMany({
      include: {
        _count: {
          select: { reviews: true },
        },
        creator: {
          select: { username: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.movie.count();

    return {
      success: true,
      data: {
        movies: movies.map((m) => ({
          id: m.id,
          title: m.title,
          slug: m.slug,
          release_year: m.releaseYear,
          subscription_type: m.subscriptionType,
          view_count: m.viewCount,
          review_count: m._count.reviews,
          created_at: m.createdAt,
          created_by: m.creator.username,
        })),
        total,
      },
    };
  }

  async update(id: string, updateMovie: UpdateMovieDto) {
    const movie = await this.prisma.movie.update({
      where: { id },
      data: {
        title: updateMovie.title,
        description: updateMovie.description,
        subscriptionType: updateMovie.subscription_type,
        movieCategories: updateMovie.category_ids
          ? {
              deleteMany: {},
              create: updateMovie.category_ids.map((catId) => ({
                categoryId: catId,
              })),
            }
          : undefined,
      },
    });

    return {
      success: true,
      message: 'Kino muvaffaqiyatli yangilandi',
      data: {
        id: movie.id,
        title: movie.title,
        updated_at: new Date(),
      },
    };
  }

  async remove(id: string) {
    await this.prisma.movie.delete({ where: { id } });
    return {
      success: true,
      message: "Kino muvaffaqiyatli o'chirildi",
    };
  }

  async uploadMovieFile(
    movieId: string,
    dto: UploadMovieFileDto,
    file: Express.Multer.File,
  ) {
    const sizeMb = +(file.size / (1024 * 1024)).toFixed(2);

    const movieFile = await this.prisma.movieFile.create({
      data: {
        movieId,
        fileUrl: file.path,
        quality: dto.quality,
        language: dto.language,
      },
    });

    return {
      success: true,
      message: 'Kino fayli muvaffaqiyatli yuklandi',
      data: {
        id: movieFile.id,
        movie_id: movieFile.movieId,
        quality: movieFile.quality,
        language: movieFile.language,
        size_mb: sizeMb,
        file_url: file.path,
      },
    };
  }
}
