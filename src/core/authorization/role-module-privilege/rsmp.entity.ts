/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-25 23:58:44
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-27 22:28:50
 */

import PrimaryEntity from '@core/Common/entities/primary.entity';
import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import ModulePrivilege from '../module-privilege/module-privilege.entity';
import Role from '../role/role.entity';
import RsmpRepository from './rsmp.repository';

@Entity({ tableName: 'rsmp', customRepository: () => RsmpRepository })
export default class RSMP extends PrimaryEntity {
  @ManyToOne(() => Role, {
    onDelete: 'cascade',
    nullable: false,
    name: 'role_id',
  })
  roleId: number;

  @ManyToOne(() => ModulePrivilege, {
    onDelete: 'cascade',
    nullable: false,
    name: 'mpm_id',
  })
  mpmId: number;

  [EntityRepositoryType]?: RsmpRepository;
}
