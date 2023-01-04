/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-30 20:57:48
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 22:38:27
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
import {
  CreateModulePrivilegeMappingDto,
  UpdateModulePrivilegeMappingDto,
} from './module-privilege.dto';
import { ModulePrivilegeService } from './module-privilege.service';

@ApiTags('System Module Privilege Mapping')
@Controller('module-privilege')
export default class ModulePrivilegeController {
  constructor(
    private readonly modulePrivilegeService: ModulePrivilegeService,
  ) {}

  @ResponseMessage(SuccessMessage.CREATE, 'module privilege mapping')
  @Post()
  async createModulePrivilegMapping(
    @Body() data: CreateModulePrivilegeMappingDto,
  ) {
    return await this.modulePrivilegeService.createMapping(data);
  }

  @ResponseMessage(SuccessMessage.FETCH, 'module privilege mapping')
  @Get()
  async getAllModulePrivilegeMapping() {
    return await this.modulePrivilegeService.getAllMapping();
  }

  @ResponseMessage(SuccessMessage.FETCH, 'module privilege mapping')
  @Get(':mappingId')
  async getodulePrivilegeMappingById(@Param('mappingId') mappingId: number) {
    return await this.modulePrivilegeService.getMappingById(mappingId);
  }

  @ResponseMessage(SuccessMessage.UPDATE, 'module privilege mapping')
  @Patch(':mappingId')
  async updateModulePrivilegeMapping(
    @Param('mappingId') mappingId: number,
    @Body()
    data: UpdateModulePrivilegeMappingDto,
  ) {
    return await this.modulePrivilegeService.updateMapping(mappingId, data);
  }

  @ResponseMessage(SuccessMessage.DELETE, 'module privilege mapping')
  @Delete(':mappingId')
  async deleteModulePrivilegeMapping(@Param('mappingId') mappingId: number) {
    return await this.modulePrivilegeService.deleteMapping(mappingId);
  }
}
