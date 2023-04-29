/*
 * @Author: prashant.chaudhary
 * @Date: 2022-10-20 10:53:22
 * @Last Modified by: prashant.chaudhary
 * @Last Modified time: 2023-04-29 21:59:03
 */

import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import morgan from 'morgan';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './pipe/validation.pipe';
import { loggerService, Stream } from './utils/logger';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const port = configService.get('http.port');
  app.useLogger(loggerService());
  app.useGlobalPipes(new CustomValidationPipe({ transform: true }));

  if (process.env.NODE_ENV === 'development' || 'local')
    app.use(morgan('dev', { stream: new Stream(loggerService()) }));
  else app.use(morgan('combined', { stream: new Stream(loggerService()) }));

  const config = new DocumentBuilder()
    .setTitle('nest-boilerplate')
    .setDescription('Boilerplate API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port, () => {
    console.info(`=================================`);
    console.info(` ========= ENV: ${process.env.NODE_ENV} ========= `);
    console.info(`🚀 App listening on the port ${port}`);
    console.info(`=================================`);
  });
}
bootstrap();
