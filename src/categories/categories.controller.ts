import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'superadmin')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'superadmin')
  findAll() {
    return this.categoriesService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'superadmin')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
