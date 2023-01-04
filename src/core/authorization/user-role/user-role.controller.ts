/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-30 20:14:10
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-02 00:09:20
 */

import { SuccessMessage } from '@core/Common/interfaces/common.interface';
import { ResponseMessage } from '@decorators/response.decorator';
import { Body, Controller, Delete, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateUserRoleDto,
  UserRoleDeleteQueryStringDto,
} from './user-role.dto';
import { UserRoleService } from './user-role.service';

@ApiTags('User Role')
@Controller('user-role')
export default class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @ResponseMessage(SuccessMessage.CREATE, 'user role mapping')
  @Post()
  async createUserRoleMapping(@Body() data: CreateUserRoleDto) {
    return await this.userRoleService.createMapping(data);
  }

  @ResponseMessage(SuccessMessage.DELETE, 'user role mapping')
  @Delete()
  async deleteUserRoleMapping(@Query() data: UserRoleDeleteQueryStringDto) {
    return await this.userRoleService.deleteMapping(data.roleId, data.userId);
  }
}
