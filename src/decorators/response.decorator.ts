/*
 * @Author: prashant.chaudhary
 * @Date: 2022-11-21 18:20:27
 * @Last Modified by:   prashant.chaudhary
 * @Last Modified time: 2022-11-21 18:20:27
 */

import { applyDecorators, SetMetadata } from '@nestjs/common';

export const ResponseMessage = (
  message: string,
  source?: string[] | string,
): any =>
  applyDecorators(
    SetMetadata('message', message.toLocaleLowerCase()),
    SetMetadata('source', source),
  );
