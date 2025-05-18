import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateadminService } from './createadmin.service';
import { CreateCreateadminDto } from './dto/create-createadmin.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('createadmin')
export class CreateadminController {
  constructor(private readonly createadminService: CreateadminService) {}

  @Post()
  @Roles('superadmin')
  create(@Body() createCreateadminDto: CreateCreateadminDto) {
    return this.createadminService.create(createCreateadminDto);
  }

  @Delete(':id')
  @Roles('superadmin')
  remove(@Param('id') id: string) {
    return this.createadminService.remove(id);
  }
}
