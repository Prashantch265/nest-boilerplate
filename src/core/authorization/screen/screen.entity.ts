/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-26 00:38:36
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-27 20:46:33
 */

import PrimaryEntity from '@core/Common/entities/primary.entity';
import { Collection, Entity, Property, OneToMany } from '@mikro-orm/core';
import Modules from '../module/module.entity';

@Entity({ tableName: 'screens' })
export default class Screen extends PrimaryEntity {
  @Property({ name: 'name' })
  name: string;

  @Property({ name: 'code', unique: true })
  code: string;

  @Property({ name: 'description', nullable: true })
  description: string;

  @OneToMany(() => Modules, (modules) => modules.screenId)
  modules = new Collection<Modules>(this);
}
