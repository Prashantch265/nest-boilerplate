/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-25 23:34:43
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-05-12 11:18:05
 */

import CommonEntity from '@core/Common/entities/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export default class User extends CommonEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'user_id',
  })
  userId: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'contact' })
  contact: string;

  @Column({ name: 'profile_pic', nullable: true })
  profilePic: string;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ name: 'email', nullable: true })
  email: string;

  @Column({ name: 'password', nullable: true })
  password: string;
}
