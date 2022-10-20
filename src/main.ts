/*
 * @Author: prashant.chaudhary 
 * @Date: 2022-10-20 10:53:22 
 * @Last Modified by:   prashant.chaudhary 
 * @Last Modified time: 2022-10-20 10:53:22 
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
