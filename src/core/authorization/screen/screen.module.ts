import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ScreenController from './screen.controller';
import Screen from './screen.entity';
import ScreenService from './screen.service';

@Module({
  imports: [TypeOrmModule.forFeature([Screen])],
  controllers: [ScreenController],
  providers: [ScreenService],
  exports: [],
})
export default class ScreenModule {}
