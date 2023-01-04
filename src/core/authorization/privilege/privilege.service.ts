import { ErrorMessage } from '@core/Common/interfaces/common.interface';
import { RuntimeException } from '@exceptions/runtime.exception';
import { FindOptions } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePrivilegeDto, UpdatePrivilegeDto } from './privilege.dto';
import Privilege from './privilege.entity';

@Injectable()
export default class PrivilegeService {
  constructor(
    @InjectRepository(Privilege)
    private readonly privilegeRepository: EntityRepository<Privilege>,
  ) {}

  async findOneByFeild(where = {}, options: FindOptions<Privilege> = {}) {
    where = { ...where, isActive: true };
    return await this.privilegeRepository.findOne(where, options);
  }

  async createPrivilege(data: CreatePrivilegeDto) {
    const instance: Privilege = await this.privilegeRepository.create({
      ...data,
      ...Privilege,
    });
    await this.privilegeRepository.persistAndFlush(instance);
    return instance;
  }

  async getAllPrivilege() {
    return await this.privilegeRepository.findAll({
      fields: ['id', 'name', 'code', 'description'],
      filters: { isActve: true },
    });
  }

  async getPrivilegeById(privilegeId: number) {
    const privilege = await this.findOneByFeild(
      { id: privilegeId },
      { fields: ['id', 'name', 'code', 'description'] },
    );

    if (!privilege)
      throw new RuntimeException(
        HttpStatus.NOT_FOUND,
        ErrorMessage.NOT_FOUND,
        'privilege',
      );

    return privilege;
  }

  async getPrivilegeByCode(code: string) {
    const privilege = await this.findOneByFeild(
      { code: code },
      { fields: ['id', 'name', 'code', 'description'] },
    );

    if (!privilege)
      throw new RuntimeException(
        HttpStatus.NOT_FOUND,
        ErrorMessage.NOT_FOUND,
        'privilege',
      );

    return privilege;
  }

  async updatePrivilege(privilegeId: number, data: UpdatePrivilegeDto) {
    const existingPrivilege = await this.getPrivilegeById(privilegeId);
    const updatedPrivilege: Privilege = this.privilegeRepository.assign(
      existingPrivilege,
      data,
    );
    await this.privilegeRepository.persistAndFlush(updatedPrivilege);
    return privilegeId;
  }

  async deletePrivilege(privilegeId: number) {
    return await this.privilegeRepository.nativeDelete({ id: privilegeId });
  }

  // async archivePrivilege(privilegeId: number){

  // }
}
