import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ModulesController from './module.controller';
import ModulesEntity from './module.entity';
import ModulesService from './module.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModulesEntity])],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService],
})
export default class ModulesModule {}
