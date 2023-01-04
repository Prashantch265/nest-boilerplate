import { FindOptions } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import ModulePrivilege from './module-privilege.entity';

export class ModulePrivilegeRepository extends EntityRepository<ModulePrivilege> {
  protected readonly entityManager = this.em.getConnection();

  async findOneByFeild(where = {}, options: FindOptions<ModulePrivilege> = {}) {
    where = { ...where, isActive: true };
    return await this.findOne(where, options);
  }

  async getMapping(mappingId?: number) {
    const replacements: Array<any> = [mappingId];

    const whereQuery = ` and mpm.id = ?`;

    return await this.entityManager.execute(
      `
    select
    modules.id,
    modules.name as "module",
    jsonb_agg(jsonb_build_object('mappingId', mpm.id, 'name', privileges.name, 'code', privileges.code, 'method', mpm.method, 'endpoint', mpm.endpoint)) as "privileges"
    from module_privilege_mapping mpm
    inner join modules on modules.id = mpm.module_id and modules.is_active is true
    inner join privileges on privileges.id = mpm.privilege_id and privileges.is_active is true
    where mpm.is_active is true ${mappingId ? whereQuery : ''}
    group by 1,2
    `,
      replacements,
    );
  }
}
