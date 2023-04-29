/*
 * @Author: prashant.chaudhary
 * @Date: 2023-03-29 15:10:21
 * @Last Modified by:   prashant.chaudhary
 * @Last Modified time: 2023-03-29 15:10:21
 */

import { RequestContext } from '@mikro-orm/core';

export const CustomTranscational = () => {
  return (target: any, nameMethod: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      if (
        process.env.NODE_ENV === 'test' &&
        !RequestContext.getEntityManager()?.isInTransaction()
      )
        return await originalMethod.apply(this, args);
      try {
        // RequestContext.getEntityManager().fork();
        let existingTransaction =
          RequestContext.getEntityManager().isInTransaction();
        const originalTransaction = !existingTransaction;
        /**
         * Create New Transaction only previous function has not created it.
         */
        if (!existingTransaction)
          await RequestContext.getEntityManager().begin();
        const value = await originalMethod.apply(this, args);
        existingTransaction =
          RequestContext.getEntityManager().isInTransaction();
        /**
         * Only Commit transaction it's started a transaction
         */
        if (existingTransaction && originalTransaction)
          await RequestContext.getEntityManager().commit();
        return value;
      } catch (error) {
        const existingTransaction =
          RequestContext.getEntityManager().isInTransaction();
        if (existingTransaction)
          await RequestContext.getEntityManager().rollback();
        throw error;
      }
    };
  };
};
