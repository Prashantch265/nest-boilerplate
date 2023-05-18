/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-26 00:38:36
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-27 20:46:33
 */

import PrimaryEntity from '@core/Common/entities/primary.entity';
import Modules from '../module/module.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'screens' })
export default class Screen extends PrimaryEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'code', unique: true })
  code: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @ManyToOne(() => Modules, (module) => module.screens)
  @JoinColumn({ name: 'module_id' })
  module: Modules;
}
