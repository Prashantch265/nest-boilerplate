/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-16 20:19:56
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-11-16 20:20:31
 */

import { PrimaryGeneratedColumn } from 'typeorm';
import CommonEntity from './common.entity';

export default class PrimaryEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
}
