/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-27 22:58:00
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-01 19:56:00
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
import { CreateModuleDto, UpdateModuleDto } from './module.dto';
import ModulesService from './module.service';

@ApiTags('System Modules')
@Controller('module')
export default class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @ResponseMessage(SuccessMessage.CREATE, 'module')
  @Post()
  async createModule(@Body() data: CreateModuleDto) {
    return await this.modulesService.createModule(data);
  }

  @ResponseMessage(SuccessMessage.FETCH, 'module')
  @Get()
  async getAllModule() {
    return await this.modulesService.getAllModules();
  }

  @ResponseMessage(SuccessMessage.FETCH, 'module')
  @Get(':moduleId')
  async getModuleById(@Param('moduleId') moduleId: number) {
    return await this.modulesService.getModuleById(moduleId);
  }

  @ResponseMessage(SuccessMessage.UPDATE, 'module')
  @Patch(':moduleId')
  async updateModule(
    @Param('moduleId') moduleId: number,
    @Body() data: UpdateModuleDto,
  ) {
    return await this.modulesService.updateModule(moduleId, data);
  }

  @ResponseMessage(SuccessMessage.DELETE, 'module')
  @Delete(':moduleId')
  async deleteModule(@Param('moduleId') moduleId: number) {
    return await this.modulesService.deleteModule(moduleId);
  }

  // @ResponseMessage(SuccessMessage.ARCHIVE, 'module')
  // @Delete('archive/:moduleId')
  // async archiveModule(@Param('moduleId') moduleId: number) {
  //   return await this.modulesService;
  // }
}
