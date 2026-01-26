import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { UserModule } from '../users.module';
import { RoleModule } from '../../../core/rbac/roles/roles.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ContextModule } from '../../../core/context/context.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    UserModule,
    RoleModule,
    ContextModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
