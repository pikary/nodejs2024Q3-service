import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter } from './modules/loggers/ExceptionFilter';
import { LoggingService } from './modules/loggers/loggingService';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logggingService = app.get(LoggingService);
  app.useGlobalFilters(new CustomExceptionFilter(logggingService));
  // const openApiDocument = yaml.load(fs.readFileSync('./doc/api.yaml', 'utf8'));
  // SwaggerModule.setup('api', app, openApiDocument);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(4000);
}
bootstrap();
