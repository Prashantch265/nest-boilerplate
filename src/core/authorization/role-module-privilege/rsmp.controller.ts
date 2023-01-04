/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-30 22:16:56
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-01 23:13:52
 */

import { SuccessMessage } from '@core/Common/interfaces/common.interface';
import { ResponseMessage } from '@decorators/response.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateRsmpDto,
  RsmpDeleteQueryStringDto,
  RsmpQueryStringDto,
} from './rsmp.dto';
import { RsmpService } from './rsmp.service';

@ApiTags('System Access Mapping')
@Controller('access')
export default class RsmpController {
  constructor(private readonly rsmpService: RsmpService) {}

  @ResponseMessage(SuccessMessage.CREATE, 'access')
  @Post()
  async createAccess(@Body() data: CreateRsmpDto) {
    return await this.rsmpService.createMapping(data);
  }

  @ResponseMessage(SuccessMessage.FETCH, 'module')
  @Get(':screenId')
  async getModuleListByScreen(@Param('screenId') screenId: number) {
    return await this.rsmpService.getModuleListByScreen(screenId);
  }

  @ResponseMessage(SuccessMessage.FETCH, 'permissions')
  @Get()
  async getPermissionsByRoleAndScreen(
    @Query() queryString: RsmpQueryStringDto,
  ) {
    return await this.rsmpService.getAllPermissionsByRoleAndScreen(
      queryString.roleId,
      queryString.screenId,
    );
  }

  @ResponseMessage(SuccessMessage.DELETE, 'access')
  @Delete()
  async deleteAccess(@Query() queryString: RsmpDeleteQueryStringDto) {
    return await this.rsmpService.deleteAccess(
      queryString.roleId,
      queryString.mpmId,
    );
  }
}
