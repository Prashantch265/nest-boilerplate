/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-25 23:34:43
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-30 23:09:03
 */

import CommonEntity from '@core/Common/entities/common.entity';
import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import UserRepository from './users.repository';

@Entity({ tableName: 'users', customRepository: () => UserRepository })
export default class User extends CommonEntity {
  @PrimaryKey({
    name: 'user_id',
    type: 'uuid',
  })
  userId: string = v4();

  @Property({ name: 'full_name' })
  fullName: string;

  @Property({ name: 'contact' })
  contact: string;

  @Property({ name: 'profile_pic', nullable: true })
  profilePic: string;

  @Property({ name: 'user_name' })
  userName: string;

  @Property({ name: 'email', nullable: true })
  email: string;

  @Property({ name: 'password', nullable: true })
  password: string;

  // to allow inference in `em.getRepository()`
  [EntityRepositoryType]?: UserRepository;
}
