import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { WinstonLoggerService } from './core/logging/service/winston-logger.service';
import otelSDK from './opentelemetry/sdk';
import { CustomValidationPipe } from './core/pipes/validation.pipe';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  // Start SDK before nestjs factory create
  otelSDK.start();

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const env = configService.get<string>('app.env', 'production');
  const port = configService.get<number>('app.port', 3000);
  const logger = app.get(WinstonLoggerService);

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.setGlobalPrefix('api', { exclude: ['static'] });
  app.use(cookieParser());
  app.useLogger(logger);
  app.useGlobalPipes(
    new CustomValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('app.name', 'Nest.js Backend'))
    .setDescription('REST API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('accessToken')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { tagsSorter: 'alpha', operationsSorter: 'alpha' },
  });

  await app.listen(port, () => {
    console.info(`=======================================================`);
    console.info(
      `===================== ENV: ${env.toUpperCase()} ======================`,
    );
    console.info(`============= App listening on port ${port} ==============`);
    console.info(`=======================================================`);
  });
}

void bootstrap();
