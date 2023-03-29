/* eslint-disable @typescript-eslint/ban-types */
/*
 * @Author: prashant.chaudhary
 * @Date: 2022-12-30 12:37:36
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-30 17:15:59
 */

import { EntityRepository } from '@mikro-orm/core';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const RepoFactory = (T: any) =>
  jest.fn(() => {
    let entityRepositoryProperties = Reflect.ownKeys(T.prototype);
    entityRepositoryProperties = [
      ...entityRepositoryProperties,
      ...Reflect.ownKeys(EntityRepository.prototype),
    ];

    return entityRepositoryProperties.reduce((obj, key, index) => {
      obj[key] = jest.fn();
      return obj;
    }, {});
  });

export const ServiceFactory = (T: any) =>
  jest.fn(() => {
    const serviceProperties = Reflect.ownKeys(T.prototype);
    return serviceProperties.reduce((obj, key, index) => {
      obj[key] = jest.fn();
      return obj;
    }, {});
  });
