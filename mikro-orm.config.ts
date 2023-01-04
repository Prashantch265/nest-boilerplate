/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-12 11:29:01
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-12 11:38:03
 */

import { pgConnectionForMikroOrm } from '@config/db-connection.configs';
import { defineConfig } from '@mikro-orm/core';

const MikroOrmDataSource = defineConfig({ ...pgConnectionForMikroOrm() });

export default MikroOrmDataSource;
