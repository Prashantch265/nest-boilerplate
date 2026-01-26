import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './roles.entity';
import { RoleService } from './roles.service';
import { PermissionModule } from '../permissions/permissions.module';
import { RoleController } from './roles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), PermissionModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
