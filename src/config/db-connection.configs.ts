/*
 * @Author: prashant.chaudhary
 * @Date: 2022-10-20 11:50:16
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-11-16 15:59:11
 */

import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { Logger } from 'mongodb';
import { readFilesFromFolder } from 'src/utils/file-to-class-converter';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const NODE_ENV = process.env.NODE_ENV;

const mongooseConnection = (
  configService: ConfigService,
): MongooseModuleFactoryOptions => {
  const mongoConfig = configService.get('database.mongodb');

  if (NODE_ENV === 'local' || 'development') Logger.setLevel('debug');

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

const pgConnection = (
  configService: ConfigService,
): PostgresConnectionOptions => {
  const postgresConfig = configService.get('database.postgres');
  return {
    type: 'postgres',
    host: postgresConfig.host,
    port: postgresConfig.port,
    username: postgresConfig.username,
    password: postgresConfig.password,
    database: postgresConfig.database,
    logging: NODE_ENV === 'local' || 'development' ? true : false,
    logger: 'debug',
    entities: readFilesFromFolder(`${__dirname}/../core/`, [
      'entity.ts',
      'entity.js',
    ]),
  };
};

export { mongooseConnection, pgConnection };
