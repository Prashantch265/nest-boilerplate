import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PermissionService } from './permissions.service';

@ApiTags('Authorization')
@Controller('permissions')
// Note: Once guards are active, this controller should be protected
// so that only authorized admins can access it.
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available permissions' })
  findAll() {
    return this.permissionService.findAll();
  }
}
