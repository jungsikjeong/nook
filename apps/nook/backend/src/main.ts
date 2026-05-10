import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import {
  RequestIdMiddleware,
  VALIDATION_PIPE_OPTIONS,
} from '@nook/nest-common';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const config = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.use(RequestIdMiddleware);

  const corsOrigin =
    config.get<string>('CORS_ORIGIN') ?? 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin.split(',').map((s) => s.trim()),
    credentials: true,
  });

  // Use URI versioning, e.g., /api/v1/endpoint
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const port = config.get<number>('PORT') ?? 3001;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Backend listening on http://localhost:${port}/api`);
}

bootstrap().catch((err) => {
  console.error('Failed to bootstrap NestJS app:', err);
  process.exit(1);
});
