/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-26 00:24:46
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 16:48:09
 */

import { FindOptions } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import Modules from './module.entity';

export default class ModuleRepository extends EntityRepository<Modules> {
  protected readonly entityManager = this.em.getConnection();

  async findOneByFeild(where = {}, options: FindOptions<Modules> = {}) {
    where = { ...where, isActive: true };
    return await this.findOne(where, options);
  }

  async getModule(moduleId?: number) {
    const replacements: Array<any> = [moduleId];

    const whereQuery = ` and modules.id = ?`;

    return await this.entityManager.execute(
      `
    select
    screens.name as "screen",
    jsonb_agg(jsonb_build_object('id', modules.id, 'name', modules.name, 'code', modules.code, 'description', modules.description, 'screenCode', screens.code)) as "modules"
    from modules
    inner join screens on screens.id = modules.screen_id and screens.is_active is true
    where modules.is_active = true ${moduleId ? whereQuery : ''}
    group by 1`,
      replacements,
    );
  }
}
