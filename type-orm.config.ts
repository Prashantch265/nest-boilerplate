/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-12 11:28:50
 * @Last Modified by:   prashant.chaudhary
 * @Last Modified time: 2022-12-12 11:28:50
 */

import { pgConnectionForTypeOrm } from '@config/db-connection.configs';
import { DataSource } from 'typeorm';

const TypeOrmDataSource = new DataSource({ ...pgConnectionForTypeOrm() });

export default TypeOrmDataSource;
