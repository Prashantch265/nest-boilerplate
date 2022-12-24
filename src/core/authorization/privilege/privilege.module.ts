import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PrivilegeController from './privilege.controller';
import Privilege from './privilege.entity';
import PrivilegeService from './privilege.service';

@Module({
  imports: [TypeOrmModule.forFeature([Privilege])],
  controllers: [PrivilegeController],
  providers: [PrivilegeService],
  exports: [],
})
export default class PrivilegeModule {}
