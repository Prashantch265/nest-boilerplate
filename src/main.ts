/*
 * @Author: prashant.chaudhary 
 * @Date: 2022-10-20 10:53:22 
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2022-10-20 11:54:33
 */

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './pipe/validation.pipe';
import { loggerService, Stream } from './utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const port = configService.get('http.port');
  app.useLogger(loggerService());
  app.useGlobalPipes(new CustomValidationPipe({ transform: true }));

  if (process.env.NODE_ENV && process.env.NODE_ENV === 'development')
    app.use(morgan('dev', { stream: new Stream(loggerService()) }));
  else app.use(morgan('combined', { stream: new Stream(loggerService()) }));
  
  await app.listen(port);
}
bootstrap();
