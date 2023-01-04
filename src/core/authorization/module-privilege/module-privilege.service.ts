/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-30 20:58:30
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 22:36:11
 */

import { ErrorMessage } from '@core/Common/interfaces/common.interface';
import { RuntimeException } from '@exceptions/runtime.exception';
import { HttpStatus, Injectable } from '@nestjs/common';
import ModulesService from '../module/module.service';
import PrivilegeService from '../privilege/privilege.service';
import {
  CreateModulePrivilegeMappingDto,
  UpdateModulePrivilegeMappingDto,
} from './module-privilege.dto';
import ModulePrivilege from './module-privilege.entity';
import { ModulePrivilegeRepository } from './module-privilege.repository';

@Injectable()
export class ModulePrivilegeService {
  constructor(
    private readonly modulePrivilegeRepository: ModulePrivilegeRepository,
    private readonly moduleService: ModulesService,
    private readonly privilegeService: PrivilegeService,
  ) {}

  async createMapping(data: CreateModulePrivilegeMappingDto) {
    const module = await this.moduleService.getModuleByCode(data.moduleCode);

    const privilege = await this.privilegeService.getPrivilegeByCode(
      data.privilegeCode,
    );

    const mapping = await this.modulePrivilegeRepository.findOneByFeild({
      moduleId: module.id,
      privilegeId: privilege.id,
    });

    if (mapping)
      throw new RuntimeException(
        HttpStatus.NOT_ACCEPTABLE,
        ErrorMessage.DUPLICATE_DATA,
        'module privilege mapping',
      );

    const modulePrivilegeMapping: ModulePrivilege =
      this.modulePrivilegeRepository.create({ ...ModulePrivilege, ...data });
    modulePrivilegeMapping.moduleId = module.id;
    modulePrivilegeMapping.privilegeId = privilege.id;
    await this.modulePrivilegeRepository.persistAndFlush(
      modulePrivilegeMapping,
    );

    return true;
  }

  async updateMapping(
    mappingId: number,
    data: UpdateModulePrivilegeMappingDto,
  ) {
    const existingMapping = await this.modulePrivilegeRepository.findOneByFeild(
      {
        id: mappingId,
      },
    );

    if (!existingMapping)
      throw new RuntimeException(
        HttpStatus.NOT_FOUND,
        ErrorMessage.NOT_FOUND,
        'module privilege mapping',
      );

    const module = await this.moduleService.getModuleByCode(data.moduleCode);

    const privilege = await this.privilegeService.getPrivilegeByCode(
      data.privilegeCode,
    );

    existingMapping.moduleId = module.id;
    existingMapping.privilegeId = privilege.id;

    const modulePrivilegeMapping: ModulePrivilege =
      this.modulePrivilegeRepository.assign(existingMapping, data);

    await this.modulePrivilegeRepository.persistAndFlush(
      modulePrivilegeMapping,
    );

    return true;
  }

  async getAllMapping() {
    return await this.modulePrivilegeRepository.getMapping();
  }

  async getMappingById(mappingId: number) {
    return await this.modulePrivilegeRepository.getMapping(mappingId);
  }

  async deleteMapping(mappingId: number) {
    return await this.modulePrivilegeRepository.nativeDelete({ id: mappingId });
  }
}
