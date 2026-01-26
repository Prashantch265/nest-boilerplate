import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { isProduction, readConfigurations } from '../configuration.module';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const config = readConfigurations();
const configService: ConfigService = new ConfigService<Record<string, unknown>>(
  config,
);

export const typeOrmConnectionOptions = (): PostgresConnectionOptions => {
  return {
    type: 'postgres',
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    username: configService.get<string>('database.username'),
    password: configService.get<string>('database.password'),
    database: configService.get<string>('database.name'),
    logging: isProduction() ? false : true,
    logger: 'debug',
    entities: [
      `${__dirname}/../../core/**/*.{ts,js}`,
      `${__dirname}/../../modules/**/*.{ts,js}`,
    ],
    migrations: [`${__dirname}/../../database/migrations/*.{ts,js}`],
    subscribers: [],
    namingStrategy: new SnakeNamingStrategy(),
  };
};

export default new DataSource(typeOrmConnectionOptions());
