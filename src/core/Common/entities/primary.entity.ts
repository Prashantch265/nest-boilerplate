/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-16 20:19:56
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-25 21:13:25
 */

import { PrimaryKey } from '@mikro-orm/core';
import CommonEntity from './common.entity';

export default class PrimaryEntity extends CommonEntity {
  @PrimaryKey({ name: 'id', autoincrement: true })
  id: number;
}
