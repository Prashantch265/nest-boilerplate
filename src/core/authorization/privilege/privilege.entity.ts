/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-25 23:59:49
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-27 20:48:31
 */

import PrimaryEntity from '@core/Common/entities/primary.entity';
import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import ModulePrivilege from '../module-privilege/module-privilege.entity';

@Entity({ tableName: 'privileges' })
export default class Privilege extends PrimaryEntity {
  @Property({ name: 'name' })
  name: string;

  @Property({ name: 'code', unique: true })
  code: string;

  @Property({ name: 'description', nullable: true })
  description: string;

  @OneToMany(
    () => ModulePrivilege,
    (modulePrivilege) => modulePrivilege.privilegeId,
  )
  modulePrivilege = new Collection<ModulePrivilege>(this);
}
