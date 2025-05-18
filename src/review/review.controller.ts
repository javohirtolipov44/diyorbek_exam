import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

@Controller('movies/:movieId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('movieId') movieId: string,
    @Req() req: any,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewService.create(
      req.user['userId'],
      movieId,
      createReviewDto,
    );
  }

  @Delete(':id')
  remove(@Param('movieId') movieId: string, @Param('id') id: string) {
    return this.reviewService.remove(movieId, id);
  }
}
