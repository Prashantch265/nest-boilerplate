import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AssignPermissionsDto } from './dtos/assign-permissions.dto';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { RoleService } from './roles.service';

@ApiTags('Authorization')
@Controller('roles')
// NOTE: This entire controller should be protected by guards once they are globally active.
// e.g., @Roles(USER_TYPE.ADMIN) @Permissions('role:manage')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single role by ID with its permissions' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update a role's name" })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Post(':id/permissions')
  @ApiOperation({ summary: 'Assign permissions to a role' })
  assignPermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return this.roleService.assignPermissions(id, assignPermissionsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.roleService.remove(id);
  }
}
