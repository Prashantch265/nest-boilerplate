/*
 * @Author: prashant.chaudhary
 * @Date: 2022-10-20 11:50:16
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-11-16 15:59:11
 */

import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { Logger } from 'mongodb';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import readConfigurations from './read-configs';

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

const pgConnectionForTypeOrm = (): PostgresConnectionOptions => {
  const config = readConfigurations();
  const configService: ConfigService = new ConfigService<
    Record<string, unknown>,
    false
  >(config);
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
    entities: [`${__dirname}/../core/**/*.entity.{ts,js}`],
    migrations: [`${__dirname}/../database/migrations/*.{ts,js}`],
    subscribers: [`${__dirname}/../database/subscriber/*.{ts,js}`],
  };
};

const pgConnectionForMikroOrm = (): MikroOrmModuleSyncOptions => {
  const config = readConfigurations();
  const configService: ConfigService = new ConfigService<
    Record<string, unknown>,
    false
  >(config);
  const postgresConfig = configService.get('database.postgres');
  return {
    type: 'postgresql',
    dbName: postgresConfig.database,
    entities: ['./dist/core/**/*.entity.js'],
    entitiesTs: ['./src/core/**/*.entity.ts'],
    subscribers: [],
    autoLoadEntities: true,
    host: postgresConfig.host,
    port: postgresConfig.port,
    user: postgresConfig.username,
    password: postgresConfig.password,
    migrations: {
      tableName: 'migrations',
      path: './dist/database/migrations/',
      pathTs: './src/database/migrations/',
    },
  };
};

const TypeOrmDataSource = new DataSource({ ...pgConnectionForTypeOrm() });

export { mongooseConnection, pgConnectionForTypeOrm, pgConnectionForMikroOrm };

export default TypeOrmDataSource;
