import { Module } from '@nestjs/common';
import { CreateadminService } from './createadmin.service';
import { CreateadminController } from './createadmin.controller';

@Module({
  controllers: [CreateadminController],
  providers: [CreateadminService],
  exports: [CreateadminService],
})
export class CreateadminModule {}
