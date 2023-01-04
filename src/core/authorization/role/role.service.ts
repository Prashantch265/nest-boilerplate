/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-26 00:12:32
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 16:48:53
 */

import { ErrorMessage } from '@core/Common/interfaces/common.interface';
import { RuntimeException } from '@exceptions/runtime.exception';
import { FindOptions } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from './role.dto';
import Role from './role.entity';

@Injectable()
export default class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
  ) {}

  async findOneByFeild(where = {}, options: FindOptions<Role> = {}) {
    where = { ...where, isActive: true };
    return await this.roleRepository.findOne(where, options);
  }

  async createRole(data: CreateRoleDto) {
    const instance: Role = this.roleRepository.create({ ...data, ...Role });
    await this.roleRepository.persistAndFlush(instance);
    return instance;
  }

  async getAll() {
    return await this.roleRepository.findAll({
      fields: ['id', 'name', 'code', 'description'],
      filters: { isActiive: true },
    });
  }

  async getRoleById(roleId: number) {
    const role = await this.findOneByFeild(
      { id: roleId },
      { fields: ['id', 'name', 'code', 'description'] },
    );
    if (!role)
      throw new RuntimeException(
        HttpStatus.NOT_FOUND,
        ErrorMessage.NOT_FOUND,
        'role',
      );
    return role;
  }

  async getRoleByCode(code: string) {
    const role = await this.findOneByFeild({ code: code });
    if (!role)
      throw new RuntimeException(
        HttpStatus.NOT_FOUND,
        ErrorMessage.NOT_FOUND,
        'role',
      );
    return role;
  }

  async updateRole(roleId: number, data: UpdateRoleDto) {
    const existingRole = await this.getRoleById(roleId);
    const updatedRole: Role = this.roleRepository.assign(existingRole, data);
    await this.roleRepository.persistAndFlush(updatedRole);
    return roleId;
  }

  async deleteRole(roleId: number) {
    return await this.roleRepository.nativeDelete({ id: roleId });
  }
}
