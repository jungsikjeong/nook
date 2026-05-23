import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { type NestExpressApplication } from '@nestjs/platform-express';
import { toNodeHandler } from 'better-auth/node';
import cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import {
  RequestIdMiddleware,
  VALIDATION_PIPE_OPTIONS,
} from '@nook/nest-common';

import { AppModule } from './app.module';
import { auth } from './lib/auth';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    bodyParser: false,
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const config = app.get(ConfigService);

  // CORS는 better-auth 핸들러보다 먼저 등록해야 한다.
  // toNodeHandler가 /api/auth/* 의 preflight(OPTIONS)를 가로채기 전에
  // cors 미들웨어가 응답 헤더를 붙이고 preflight를 처리하도록 한다.
  const configuredCorsOrigins = (config.get<string>('CORS_ORIGIN') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const corsOrigins = [
    process.env.WEB_URL ?? 'http://localhost:3000',
    ...configuredCorsOrigins,
  ];
  app.enableCors({
    origin: [...new Set(corsOrigins)],
    credentials: true,
  });

  app.use(RequestIdMiddleware);
  app.use('/api/auth', toNodeHandler(auth));
  app.use(cookieParser());
  app.useBodyParser('json');
  app.useBodyParser('urlencoded', { extended: true });

  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));

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
