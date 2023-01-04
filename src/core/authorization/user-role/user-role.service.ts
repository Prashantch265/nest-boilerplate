/*
 * @Author: prashant.chaudhary
 * @Date: 2023-01-01 23:44:08
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 16:44:52
 */

import { userType } from '@auth/auth.interface';
import { ErrorMessage } from '@core/Common/interfaces/common.interface';
import { RuntimeException } from '@exceptions/runtime.exception';
import { HttpStatus, Injectable } from '@nestjs/common';
import RoleService from '../role/role.service';
import { CreateUserRoleDto } from './user-role.dto';
import UserRole from './user-role.entity';
import UserRoleRepository from './user-role.repository';

@Injectable()
export class UserRoleService {
  constructor(
    private readonly userRoleRepository: UserRoleRepository,
    private readonly roleService: RoleService,
  ) {}

  async createMapping(data: CreateUserRoleDto) {
    const { id } = await this.roleService.getRoleByCode(data.roleCode);
    const existingMapping = await this.userRoleRepository.findOneByFeild({
      roleId: id,
      internalUserId: data.internalUserId,
    });

    if (existingMapping)
      throw new RuntimeException(
        HttpStatus.NOT_ACCEPTABLE,
        ErrorMessage.DUPLICATE_DATA,
        'user role mapping',
      );

    const instance: UserRole = this.userRoleRepository.create({
      ...data,
      ...UserRole,
    });
    instance.roleId = id;
    await this.userRoleRepository.persistAndFlush(instance);
    return true;
  }

  //   async getInternalUsers(userId?: string) {
  //     return await this.userRoleRepository.getInternalUsers(userId);
  //   }

  async getUsersByRole(roleId: number) {
    return await this.userRoleRepository.getUsersByRole(roleId);
  }

  async getPermissionsForUser(userId: string, type: userType) {
    return await this.userRoleRepository.getPermissionsForUser(userId, type);
  }

  async deleteMapping(roleId: number, userId: string) {
    return await this.userRoleRepository.nativeDelete({
      roleId: roleId,
      internalUserId: userId,
    });
  }
}
