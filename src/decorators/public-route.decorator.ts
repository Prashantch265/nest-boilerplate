/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-05 22:39:51
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-05 22:41:01
 */

import { SetMetadata } from '@nestjs/common';

export const SKIP_AUTH = 'SkipAuth';
export const Public = () => SetMetadata(SKIP_AUTH, true);
