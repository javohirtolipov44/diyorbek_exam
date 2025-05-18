import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import slugify from 'slugify';
import { PrismaService } from 'nestjs-prisma';
@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, description } = createCategoryDto;
    const slug = slugify(name, { lower: true });

    const category = await this.prisma.category.create({
      data: {
        name,
        slug,
        description,
      },
    });

    console.log(category);

    return {
      success: true,
      message: 'Kategoriya yaratildi',
      data: {
        ...category,
      },
    };
  }

  async findAll() {
    const categories = await this.prisma.category.findMany();

    return {
      success: true,
      data: {
        categories,
      },
    };
  }

  async remove(id: string) {
    await this.prisma.category.delete({
      where: { id },
    });
    return {
      success: true,
      message: 'Kategoriya ochirildi',
    };
  }
}
