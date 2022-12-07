import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import PaginationService from 'src/core/Common/services/pagination.service';
import { RuntimeException } from 'src/exceptions/runtime.exception';
import { Repository } from 'typeorm';
import Role from './role.entity';
import { QueryStringsRole, TypesRole } from './role.interface';

@Injectable()
export default class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly paginationService: PaginationService,
  ) {}

  async findOneByField(where = {}, relations = []) {
    where = { ...where, isDeleted: false, isActive: true };
    return this.roleRepository.findOne({ where, relations });
  }

  async add(data: TypesRole) {
    const existingRole = await this.findOneByField({ name: data.name });
    if (existingRole) throw new RuntimeException(400, 'duplicateData', 'role');

    return await this.roleRepository.save(data);
  }

  async update(data: TypesRole, id: number) {
    const existingRole = await this.findOneByField({ id: id });
    const updatedRole = { ...existingRole, ...data };
    return await this.roleRepository.save(updatedRole);
  }

  async getAll(queryStrings: QueryStringsRole) {
    const whereQuery = ` is_active = true and is_deleted = false`;
    const selectQuery = `select id, name, code, description from roles where ${whereQuery}`;
    const countQuery = `select count(id) from roles where ${whereQuery}`;
    return await this.paginationService.pagination(
      selectQuery,
      countQuery,
      queryStrings,
    );
  }
}
