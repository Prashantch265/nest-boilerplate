import PaginationService from '@core/Common/services/pagination.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import RoleController from './role.controller';
import Role from './role.entity';
import RoleService from './role.service';

@Module({
  imports: [MikroOrmModule.forFeature([Role]), PaginationService],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export default class RoleModule {}
