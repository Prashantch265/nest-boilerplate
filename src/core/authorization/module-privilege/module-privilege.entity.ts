/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-27 20:46:49
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-30 22:09:25
 */

import PrimaryEntity from '@core/Common/entities/primary.entity';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import Modules from '../module/module.entity';
import Privilege from '../privilege/privilege.entity';
import RSMP from '../role-module-privilege/rsmp.entity';
import { ModulePrivilegeRepository } from './module-privilege.repository';

@Entity({
  tableName: 'module_privilege_mapping',
  customRepository: () => ModulePrivilegeRepository,
})
export default class ModulePrivilege extends PrimaryEntity {
  @ManyToOne(() => Modules, {
    onDelete: 'cascade',
    nullable: false,
    name: 'module_id',
  })
  moduleId: number;

  @ManyToOne(() => Privilege, {
    onDelete: 'cascade',
    nullable: false,
    name: 'privilege_id',
  })
  privilegeId: number;

  @Property({ name: 'method' })
  method: string;

  @Property({ name: 'endpoint' })
  endpoint: string;

  @OneToMany(() => RSMP, (rsmp) => rsmp.mpmId)
  rsmp = new Collection<RSMP>(this);

  [EntityRepositoryType]?: ModulePrivilegeRepository;
}
