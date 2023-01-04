/*
 * @Author: prashant.chaudhary
 * @Date: 2022-10-20 11:50:16
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-12-28 19:54:12
 */

import { MikroEntitySubscriber } from '@database/subscribers/mikro-entity.subscriber';
import { Utils } from '@mikro-orm/core';
import { TSMigrationGenerator } from '@mikro-orm/migrations';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Logger } from 'mongodb';
import readConfigurations from './read-configs';
import { loggerService } from '@utils/logger';

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
    logging: process.env.NODE_ENV === 'local' || 'development' ? true : false,
    logger: 'debug',
    entities: [`${__dirname}/../core/**/*.entity.{ts,js}`],
    migrations: [`${__dirname}/../database/migrations/*.{ts,js}`],
    subscribers: [
      `${__dirname}/../database/subscribers/typeorm-entity.subscriber.{ts,js}`,
    ],
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
    entities: ['./src/core/**/*.entity.js'],
    entitiesTs: ['./src/core/**/*.entity.ts'],
    subscribers: [new MikroEntitySubscriber()],
    autoLoadEntities: true,
    host: postgresConfig.host,
    port: postgresConfig.port,
    user: postgresConfig.username,
    password: postgresConfig.password,
    registerRequestContext: true,
    debug: process.env.NODE_ENV === 'local' || 'development' ? true : false,
    logger: (msg) => loggerService().log(msg),
    migrations: {
      tableName: 'migrations',
      path: Utils.detectTsNode()
        ? './src/database/migrations/'
        : './dist/database/migrations/',
      glob: '!(*.d).{js,ts}',
      transactional: true,
      emit: 'ts',
      snapshot: false,
      generator: TSMigrationGenerator,
    },
    seeder: {
      path: Utils.detectTsNode()
        ? './src/database/seeder/'
        : './dist/database/seeder/',
      pathTs: undefined,
      defaultSeeder: 'DatabaseSeeder',
      glob: '!(*.d).{js,ts}',
      emit: 'ts',
      fileName: (className: string) => className,
    },
  };
};

export { mongooseConnection, pgConnectionForTypeOrm, pgConnectionForMikroOrm };
