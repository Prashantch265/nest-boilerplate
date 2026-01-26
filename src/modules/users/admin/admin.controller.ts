import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { USER_TYPE } from '../../../common/enums/users.enum';
import { Roles } from '../../../core/decorators/roles.decorator';
import { SuccessMessage } from '../../../core/decorators/success-message.decorator';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UpdateAdminProfileDto } from './dtos/update-admin.dto';
import { AdminService } from './admin.service';
import { Permissions } from '../../../core/decorators/permissions.decorator';
import { AdminQueryDto } from './dtos/query-admin.dto';
import { UpdateAdminStatusDto } from './dtos/update-admin-status.dto';
import { AssignAdminRolesDto } from './dtos/assign-admin-roles.dto';
import { ChangeAdminPasswordDto } from './dtos/change-admin-password.dto';

@ApiTags('Admin Management')
@Controller('admins')
@Roles(USER_TYPE.ADMIN) // Protect all routes in this controller
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  // @Permissions('user:create')
  @ApiOperation({
    summary: 'Create a new admin user',
    description:
      'Creates a new user with the ADMIN role, creates their admin profile, and assigns them the specified roles from the database.',
  })
  @SuccessMessage('Admin user created successfully.')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  // @Permissions('user:view')
  @ApiOperation({
    summary: 'Get paginated list of admin users',
    description:
      'Retrieves a paginated list of admin profiles, including their base user data (email, status, last login) and assigned roles. Supports search (name, email), sorting (firstName, email, lastLoginAt), and filtering by status (ACTIVE, INACTIVE).',
  })
  @SuccessMessage('Admin users retrieved successfully.')
  findAllPaginated(@Query() query: AdminQueryDto) {
    return this.adminService.findAllPaginated(query);
  }

  @Get(':id')
  // @Permissions('user:view')
  @ApiOperation({
    summary: 'Get a single admin user',
    description:
      'Retrieves the complete profile for a single admin user by their adminId, including user details and roles.',
  })
  @SuccessMessage('Admin user retrieved successfully.')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.findOne(id);
  }

  @Patch(':id/profile')
  // @Permissions('user:edit')
  @ApiOperation({
    summary: 'Update admin profile information',
    description: "Updates an admin's name, position, contact number, or email.",
  })
  @SuccessMessage('Admin profile updated successfully.')
  updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateAdminProfileDto,
  ) {
    return this.adminService.updateProfile(id, updateDto);
  }

  @Patch(':id/password')
  // @Permissions('user:edit') // Or a more specific password permission if desired
  @ApiOperation({ summary: "Change an admin's password" })
  @HttpCode(HttpStatus.NO_CONTENT) // Typically no body returned on password change
  @SuccessMessage('Admin password changed successfully.') // Optional for 204
  changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changePasswordDto: ChangeAdminPasswordDto,
  ) {
    return this.adminService.changePassword(id, changePasswordDto);
  }

  @Patch(':id/roles')
  // @Permissions('role:manage') // Use role management permission
  @ApiOperation({ summary: 'Assign roles to an admin' })
  @SuccessMessage('Admin roles updated successfully.')
  assignRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignRolesDto: AssignAdminRolesDto,
  ) {
    return this.adminService.assignRoles(id, assignRolesDto);
  }

  @Patch(':id/status')
  // @Permissions('user:edit') // Requires edit permission
  @ApiOperation({ summary: 'Update admin user status (Active/Inactive)' })
  @SuccessMessage('Admin user status updated successfully.')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateAdminStatusDto,
  ) {
    return this.adminService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  // @Permissions('user:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete an admin user',
    description:
      'Deletes an admin profile. The associated user record is also deleted due to database cascade constraints.',
  })
  @SuccessMessage('Admin user deleted successfully.') // Optional for 204
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.remove(id);
  }
}
