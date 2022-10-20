/*
 * @Author: prashant.chaudhary 
 * @Date: 2022-10-20 11:48:27 
 * @Last Modified by:   prashant.chaudhary 
 * @Last Modified time: 2022-10-20 11:48:27 
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import readConfigurations from './read-configs';

@Module({
  imports: [
    {
      ...ConfigModule.forRoot({ load: [() => readConfigurations()] }),
      global: true,
    },
  ],
  providers: [],
  exports: [ConfigModule],
})
export class ConfigurationModule {}