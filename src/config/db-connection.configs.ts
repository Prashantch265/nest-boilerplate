/*
 * @Author: prashant.chaudhary 
 * @Date: 2022-10-20 11:50:16 
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-10-20 11:51:29
 */

import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { Logger } from 'mongodb';

const mongooseConnection = (
  configService: ConfigService,
): MongooseModuleFactoryOptions => {
  const mongoConfig = configService.get('database.mongodb');
  Logger.setLevel('debug');
  const connectionName = `mongodb://${mongoConfig.userName}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}`;
  return {
    uri: connectionName,
    retryAttempts: 1,
    dbName: mongoConfig.database,
    logger: Logger.setCurrentLogger((msg, context) => {
      console.log(msg, context);
    }),
  };
};

export { mongooseConnection };