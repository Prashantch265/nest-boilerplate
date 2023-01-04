/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-27 20:50:21
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 16:49:03
 */

import { FindOptions } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import RSMP from './rsmp.entity';

export default class RsmpRepository extends EntityRepository<RSMP> {
  private readonly entityManager = this.em.getConnection();

  async findOneByFeild(where = {}, options: FindOptions<RSMP> = {}) {
    where = { ...where, isActive: true };
    return await this.findOne(where, options);
  }

  async getModulesByScreen(screenId: number) {
    const replacements: Array<any> = [screenId];

    return await this.entityManager.execute(
      `
    select
    modules.id,
    modules.name,
    modules.code
    from modules
    inner join screens on screens.id = modules.screen_id and screens.is_active is true
    where modules.is_active = true and screens.id = ?;
    `,
      replacements,
    );
  }

  async getPrivilegesByRoleAndScreen(roleId: number, screenId: number) {
    const replacements: Array<any> = [roleId, screenId];

    return await this.entityManager.execute(
      `
    select
    modules.name as "module",
    jsonb_agg(jsonb_build_object('mpmId', mpm.id, 'name', privileges.name, 'code', privileges.code, 'method', mpm.method, 'endpoint', mpm.endpoint,
        'isActive', case when rsmp.mpm_id is not null then true else false end)) as "privileges"
    from rsmp
    inner join module_privilege_mapping mpm on mpm.id = rsmp.mpm_id and mpm.is_active is true
    left join roles on roles.id = rsmp.role_id and roles.is_active is true
    inner join modules on modules.id = mpm.module_id and modules.is_active is true
    inner join privileges on privileges.id = mpm.privilege_id and privileges.is_active is true
    inner join screens on screens.id = modules.screen_id and screens.is_active is true
    where roles.id = ? and screens.id = ?
    group by 1
    `,
      replacements,
    );
  }
}
