/*
 * @Author: prashant.chaudhary
 * @Date: 2023-01-01 19:31:24
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 22:48:03
 */

import { ErrorMessage } from '@core/Common/interfaces/common.interface';
import { RuntimeException } from '@exceptions/runtime.exception';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateRsmpDto } from './rsmp.dto';
import RSMP from './rsmp.entity';
import RsmpRepository from './rsmp.repository';

@Injectable()
export class RsmpService {
  constructor(private readonly rsmpRepository: RsmpRepository) {}

  async createMapping(data: CreateRsmpDto) {
    const existingMapping = await this.rsmpRepository.findOneByFeild({
      roleId: data.roleId,
      mpmId: data.mpmId,
    });

    if (existingMapping)
      throw new RuntimeException(
        HttpStatus.NOT_ACCEPTABLE,
        ErrorMessage.DUPLICATE_DATA,
        'access',
      );

    const instance: RSMP = this.rsmpRepository.create({ ...RSMP, ...data });
    await this.rsmpRepository.persistAndFlush(instance);
    return true;
  }

  async getModuleListByScreen(screenId: number) {
    return await this.rsmpRepository.getModulesByScreen(screenId);
  }

  async getAllPermissionsByRoleAndScreen(roleId: number, screenId: number) {
    return await this.rsmpRepository.getPrivilegesByRoleAndScreen(
      roleId,
      screenId,
    );
  }

  async deleteAccess(roleId: number, mpmId: number) {
    return await this.rsmpRepository.nativeDelete({
      roleId: roleId,
      mpmId: mpmId,
    });
  }
}
