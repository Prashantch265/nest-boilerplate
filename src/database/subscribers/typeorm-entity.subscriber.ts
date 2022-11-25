import { Inject, Injectable } from '@nestjs/common';
import { RequestContextProvider } from 'src/contexts/express-http.context';
import {
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@Injectable()
export default class EntitySubscriber implements EntitySubscriberInterface {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  @Inject()
  private readonly requestContextProvider: RequestContextProvider;

  beforeInsert(event: InsertEvent<any>): void | Promise<any> {
    const userId: string = this.requestContextProvider.get('user').sub;
    const createdBy = event.metadata.findColumnWithPropertyName('createdBy');
    const updatedBy = event.metadata.findColumnWithPropertyName('updatedBy');
    if (userId) {
      if (!event?.entity?.createdBy && createdBy)
        event.entity.createdBy = userId ? userId : null;
      if (!event?.entity?.updatedBy && updatedBy)
        event.entity.updatedBy = userId ? userId : null;
    }
    return event.entity;
  }

  beforeUpdate(event: UpdateEvent<any>): void | Promise<any> {
    const userId: string = this.requestContextProvider.get('user').sub;
    const updatedBy = event.metadata.findColumnWithPropertyName('updatedBy');
    if (!event?.entity?.updatedBy && updatedBy)
      event.entity.updatedBy = userId ? userId : null;
  }
}
