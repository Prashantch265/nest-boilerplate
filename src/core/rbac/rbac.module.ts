import { Module } from '@nestjs/common';
import { PermissionModule } from './permissions/permissions.module';
import { RoleModule } from './roles/roles.module';

@Module({
  imports: [PermissionModule, RoleModule],
})
export class AuthorizationModule {}
