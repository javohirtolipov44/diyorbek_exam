import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateMovieDto } from './dto/CreateMovieDto ';
import { UpdateMovieDto } from './dto/UpdateMovieDto ';
import { UploadMovieFileDto } from './dto/UploadMovieFileDto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/movies')
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'superadmin')
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './uploads/posters',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMovie: CreateMovieDto,
    @Req() req: any,
  ) {
    return await this.adminService.create(
      createMovie,
      file,
      req.user['userId'],
    );
  }

  @Get('/movies')
  @Roles('admin', 'superadmin')
  findAll() {
    return this.adminService.findAll();
  }

  @Put('/movies/:id')
  @Roles('admin', 'superadmin')
  update(@Param('id') id: string, @Body() updateMovie: UpdateMovieDto) {
    console.log(id);
    return this.adminService.update(id, updateMovie);
  }

  @Delete('/movies/:id')
  @Roles('admin', 'superadmin')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }

  @Post('/movies/:id/files')
  @Roles('admin', 'superadmin')
  @UseInterceptors(FileInterceptor('file'))
  uploadMovieFile(
    @Param('id') movieId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMovieFileDto,
  ) {
    return this.adminService.uploadMovieFile(movieId, dto, file);
  }
}
