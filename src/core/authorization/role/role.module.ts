import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Role from './role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [],
  providers: [],
  exports: [],
})
export default class RoleModule {}
