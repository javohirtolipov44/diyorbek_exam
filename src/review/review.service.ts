import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    userId: string,
    movieId: string,
    createReviewDto: CreateReviewDto,
  ) {
    const { rating, comment } = createReviewDto;

    const data = await this.prisma.review.create({
      data: {
        userId: userId,
        movieId: movieId,
        rating: rating,
        comment: comment,
      },
      include: {
        movie: true,
      },
    });

    return {
      success: true,
      data: { ...data },
    };
  }

  async remove(movieId: string, id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: {
        id: movieId,
      },
    });
    if (!movie) {
      throw new NotFoundException('Movie topilmadi');
    }
    const review = await this.prisma.review.findUnique({
      where: {
        id: id,
      },
    });

    if (!review) {
      throw new NotFoundException('Review topilmadi');
    }

    const data = await this.prisma.review.delete({
      where: {
        id: id,
      },
    });

    return {
      success: true,
      message: "Sharh muvaffaqiyatli o'chirildi",
    };
  }
}
