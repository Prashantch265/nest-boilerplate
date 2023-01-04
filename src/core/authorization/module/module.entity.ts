/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-26 00:27:57
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-27 20:46:06
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
import ModulePrivilege from '../module-privilege/module-privilege.entity';
import Screen from '../screen/screen.entity';
import ModuleRepository from './module.repository';

@Entity({ tableName: 'modules', customRepository: () => ModuleRepository })
export default class Modules extends PrimaryEntity {
  @Property({ name: 'name' })
  name: string;

  @Property({ name: 'code', unique: true })
  code: string;

  @Property({ name: 'description', nullable: true })
  description: string;

  @ManyToOne(() => Screen, {
    onDelete: 'cascade',
    fieldName: 'screen_id',
    nullable: true,
  })
  screenId: number;

  @OneToMany(
    () => ModulePrivilege,
    (modulePrivilege) => modulePrivilege.moduleId,
  )
  modulePrivilege = new Collection<ModulePrivilege>(this);

  [EntityRepositoryType]?: ModuleRepository;
}
