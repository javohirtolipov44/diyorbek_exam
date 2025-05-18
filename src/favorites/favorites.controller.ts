import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.create(
      req.user['userId'],
      createFavoriteDto.movie_id,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: any) {
    return this.favoritesService.findAll(req.user['userId']);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoritesService.remove(id);
  }
}
