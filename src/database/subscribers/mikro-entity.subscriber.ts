/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-28 19:50:25
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-01-02 12:11:24
 */

import { EventArgs, EventSubscriber, RequestContext } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MikroEntitySubscriber implements EventSubscriber {
  async beforeCreate(args: EventArgs<any>): Promise<void> {
    const userId = RequestContext.currentRequestContext().map.get('userId');
    if (userId) args.entity.createdBy = userId;
  }
  async beforeUpdate(args: EventArgs<any>): Promise<void> {
    const userId = RequestContext.currentRequestContext().map.get('userId');
    if (userId) args.entity.updatedBy = userId;
  }
}
