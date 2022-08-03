import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';

@Module({
  providers: [ExcelService],
  controllers: [ExcelController],
})
export class ExcelModule {}
