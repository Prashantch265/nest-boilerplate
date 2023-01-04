/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-30 07:49:30
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-02 00:12:12
 */

import { SuccessMessage } from '@core/Common/interfaces/common.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { CreateRoleDto, QueryStringsRole, UpdateRoleDto } from './role.dto';
import RoleService from './role.service';

@ApiTags('System Role')
@Controller('role')
export default class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ResponseMessage(SuccessMessage.CREATE, 'role')
  @Post()
  async create(@Body() data: CreateRoleDto) {
    return await this.roleService.createRole(data);
  }

  @ResponseMessage(SuccessMessage.FETCH, 'role')
  @Get()
  async getAll(@Query() queryStrings: QueryStringsRole) {
    return await this.roleService.getAll();
  }

  @ResponseMessage(SuccessMessage.FETCH, 'role')
  @Get(':roleId')
  async getRoleById(@Param('roleId') roleId: number) {
    return await this.roleService.getRoleById(roleId);
  }

  @ResponseMessage(SuccessMessage.UPDATE, 'role')
  @Patch(':roleId')
  async updateRole(
    @Param('roleId') roleId: number,
    @Body() data: UpdateRoleDto,
  ) {
    return await this.roleService.updateRole(roleId, data);
  }

  @ResponseMessage(SuccessMessage.DELETE, 'role')
  @Delete(':roleId')
  async deleteRole(@Param('roleId') roleId: number) {
    return await this.roleService.deleteRole(roleId);
  }

  // @ResponseMessage(SuccessMessage.ARCHIVE, 'role')
  // @Delete('archive/:roleId')
  // async archiveRole(@Param('roleId') roleId: number) {
  //   return await this.roleService;
  // }
}
