import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        filename: (req, file, cb) => {
          const extname = `${uuidv4()}${path.extname(file.originalname)}`;
          cb(null, `${extname}`);
        },
        destination: './uploads',
      }),
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
