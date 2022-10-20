/*
 * @Author: prashant.chaudhary 
 * @Date: 2022-10-20 10:53:47 
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-10-20 11:53:13
 */

import { Module, Logger, CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConnection } from './config/db-connection.configs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './config/configuration.module';
import { importClassesFromDirectories } from './utils/file-to-class-converter';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true, ttl: 0 }),
    ConfigModule.forRoot({ envFilePath: '.env' }),
    ConfigurationModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        mongooseConnection(configService),
    }),
    ...importClassesFromDirectories(),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}