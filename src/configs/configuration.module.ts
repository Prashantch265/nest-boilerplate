import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { join } from 'path';

let YAML_CONFIG_FILENAME: string = 'config.yaml';

if (process.env.NODE_ENV) {
  YAML_CONFIG_FILENAME = `${process.env.NODE_ENV?.toLowerCase()}.config.yaml`;
}

export function isProduction() {
  return process.env.NODE_ENV?.toLowerCase() === 'production';
}

export function readConfigurations() {
  const configs = load(
    readFileSync(join(__dirname, 'yaml', YAML_CONFIG_FILENAME), 'utf8'), // __dirname is dist/configs after build
  ) as Record<string, any>;

  return configs;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => readConfigurations()],
    }),
  ],
  providers: [],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
