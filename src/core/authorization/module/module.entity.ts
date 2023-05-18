/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-26 00:27:57
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-27 20:46:06
 */

import PrimaryEntity from '@core/Common/entities/primary.entity';
import ModulePrivilege from '../module-privilege/module-privilege.entity';
import Screen from '../screen/screen.entity';
import ModuleRepository from './module.repository';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'modules' })
export default class Modules extends PrimaryEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'code', unique: true })
  code: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @OneToMany(() => Screen, (screen) => screen.module)
  screens: Screen[];
}
