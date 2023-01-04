/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-30 07:49:15
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-01 19:56:53
 */

import { SuccessMessage } from '@core/Common/interfaces/common.interface';
import { ResponseMessage } from '@decorators/response.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePrivilegeDto, UpdatePrivilegeDto } from './privilege.dto';
import PrivilegeService from './privilege.service';

@ApiTags('System Privilege')
@Controller('privilege')
export default class PrivilegeController {
  constructor(private readonly privilegeService: PrivilegeService) {}

  @ResponseMessage(SuccessMessage.CREATE, 'privilege')
  @Post()
  async createPrivilege(@Body() data: CreatePrivilegeDto) {
    return await this.privilegeService.createPrivilege(data);
  }

  @ResponseMessage(SuccessMessage.FETCH, 'privilege')
  @Get()
  async getAllPrivilege() {
    return await this.privilegeService.getAllPrivilege();
  }

  @ResponseMessage(SuccessMessage.FETCH, 'privilege')
  @Get(':privilegeId')
  async getPrivilegeById(@Param('privilegeId') privilegeId: number) {
    return await this.privilegeService.getPrivilegeById(privilegeId);
  }

  @ResponseMessage(SuccessMessage.UPDATE, 'privilege')
  @Patch(':privilegeId')
  async updatePrivilege(
    @Param('privilegeId') privilegeId: number,
    @Body()
    data: UpdatePrivilegeDto,
  ) {
    return await this.privilegeService.updatePrivilege(privilegeId, data);
  }

  @ResponseMessage(SuccessMessage.DELETE, 'privilege')
  @Delete(':privilegeId')
  async deletePrivilege(@Param('privilegeId') privilegeId: number) {
    return await this.privilegeService.deletePrivilege(privilegeId);
  }

  // @ResponseMessage(SuccessMessage.ARCHIVE, 'privilege')
  // @Delete('archive/:privilegeId')
  // async archivePrivilege(@Param('privilegeId') privilegeId: number) {
  //   return await this.privilegeService;
  // }
}
