/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-26 00:26:31
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 16:05:05
 */

import { ErrorMessage } from '@core/Common/interfaces/common.interface';
import { RuntimeException } from '@exceptions/runtime.exception';
import { HttpStatus, Injectable } from '@nestjs/common';
import ScreenService from '../screen/screen.service';
import { CreateModuleDto, UpdateModuleDto } from './module.dto';
import Modules from './module.entity';
import ModuleRepository from './module.repository';

@Injectable()
export default class ModulesService {
  constructor(
    private readonly moduleRepository: ModuleRepository,
    private readonly screenService: ScreenService,
  ) {}

  async createModule(data: CreateModuleDto) {
    const { id } = await this.screenService.getScreenByCode(data.screenCode);
    const instance: Modules = this.moduleRepository.create({
      ...Modules,
      ...data,
    });
    instance.screenId = id;
    await this.moduleRepository.persistAndFlush(instance);
    return instance;
  }

  async getAllModules() {
    return await this.moduleRepository.getModule();
  }

  async getModuleById(moduleId: number) {
    const module = await this.moduleRepository.getModule(moduleId);

    if (!module)
      throw new RuntimeException(
        HttpStatus.NOT_FOUND,
        ErrorMessage.NOT_FOUND,
        'module',
      );

    return module;
  }

  async getModuleByCode(code: string) {
    const module = await this.moduleRepository.findOneByFeild(
      { code: code },
      { fields: ['id', 'name', 'code', 'description', 'screenId'] },
    );

    if (!module)
      throw new RuntimeException(
        HttpStatus.NOT_FOUND,
        ErrorMessage.NOT_FOUND,
        'module',
      );

    return module;
  }

  async updateModule(moduleId: number, data: UpdateModuleDto) {
    const existingModule = await this.moduleRepository.findOneByFeild({
      id: moduleId,
    });

    if (!existingModule)
      throw new RuntimeException(
        HttpStatus.NOT_FOUND,
        ErrorMessage.NOT_FOUND,
        'module',
      );

    const { id } = await this.screenService.getScreenByCode(data.screenCode);
    existingModule.screenId = id;
    const updatedModule = this.moduleRepository.assign(existingModule, data);
    await this.moduleRepository.persistAndFlush(updatedModule);
    return moduleId;
  }

  async deleteModule(moduleId: number) {
    return await this.moduleRepository.nativeDelete({ id: moduleId });
  }

  // async archiveModule(moduleId: number) {
  //   const existingModule = await this.moduleRepository.findOneByFeild({
  //     id: moduleId,
  //   });

  //   existingModule.isActive = false;

  //   await this.moduleRepository.persistAndFlush(existingModule);
  //   return moduleId;
  // }
}
