/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-28 20:00:10
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-01 23:17:17
 */

import PrimaryEntity from '@core/Common/entities/primary.entity';
import ExternalUser from '@core/external-users/external-users.entity';
import User from '@core/users/users.entity';
import { Entity, EntityRepositoryType, ManyToOne } from '@mikro-orm/core';
import Role from '../role/role.entity';
import UserRoleRepository from './user-role.repository';

@Entity({ tableName: 'user_role', customRepository: () => UserRoleRepository })
export default class UserRole extends PrimaryEntity {
  @ManyToOne(() => User, {
    onDelete: 'cascade',
    name: 'internal_user_id',
    nullable: true,
  })
  internalUserId: string;

  @ManyToOne(() => ExternalUser, {
    onDelete: 'cascade',
    name: 'external_user_id',
    nullable: true,
  })
  externalUserId: string;

  @ManyToOne(() => Role, {
    onDelete: 'cascade',
    nullable: true,
    name: 'role_id',
  })
  roleId: number;

  [EntityRepositoryType]?: UserRoleRepository;
}
