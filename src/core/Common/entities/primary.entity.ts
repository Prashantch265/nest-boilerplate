/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-16 20:19:56
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-05-12 11:15:58
 */

import CommonEntity from './common.entity';
import { PrimaryGeneratedColumn } from 'typeorm';

export default class PrimaryEntity extends CommonEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
}
