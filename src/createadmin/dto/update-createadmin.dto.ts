import { PartialType } from '@nestjs/swagger';
import { CreateCreateadminDto } from './create-createadmin.dto';

export class UpdateCreateadminDto extends PartialType(CreateCreateadminDto) {}
