import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter } from './modules/loggers/ExceptionFilter';
import { BaseLogger } from './modules/loggers/BaseLogger';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const baselogger = app.get(BaseLogger);
  app.useGlobalFilters(new CustomExceptionFilter(baselogger));
  // const openApiDocument = yaml.load(fs.readFileSync('./doc/api.yaml', 'utf8'));
  // SwaggerModule.setup('api', app, openApiDocument);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  process
    .on('unhandledRejection', (reason, p) => {
      console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', (err) => {
      console.error(err, 'Uncaught Exception thrown');
      process.exit(1);
    });

  await app.listen(4000);
}
bootstrap();
