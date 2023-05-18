/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-26 00:24:46
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-03 16:48:09
 */

import { FindOneOptions, Repository } from 'typeorm';
import Modules from './module.entity';

export default class ModuleRepository extends Repository<Modules> {
  async findOneByField(options: FindOneOptions) {
    const { where } = options;
    options.where = { ...where, isActive: true };
    return super.findOne(options);
  }

  async getModule(moduleId?: number) {
    const replacements: Array<any> = [moduleId];

    const whereQuery = ` and modules.id = $1`;

    return await super.query(
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
