import 'dotenv/config';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import {
  oauthProviderAuthServerMetadata,
  oauthProviderOpenIdConfigMetadata,
} from '@better-auth/oauth-provider';
import { toNodeHandler } from 'better-auth/node';
import express, { type Express } from 'express';

import { AppModule } from './app.module';
import { auth } from './lib/auth';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  // better-auth는 가공되지 않은 원본 요청 스트림을 받아야 하므로
  // body parser 미들웨어보다 먼저 마운트한다.
  app.use('/api/auth', toNodeHandler(auth));

  // OIDC / OAuth 2.0 디스커버리 메타데이터.
  // 플러그인은 fetch 스타일 핸들러를 반환하므로 toNodeHandler로 Node req/res에 연결한다.
  const expressApp = app.getHttpAdapter().getInstance() as Express;
  expressApp.get(
    '/.well-known/openid-configuration',
    toNodeHandler(oauthProviderOpenIdConfigMetadata(auth)),
  );
  expressApp.get(
    '/.well-known/oauth-authorization-server',
    toNodeHandler(oauthProviderAuthServerMetadata(auth)),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin.split(',').map((s) => s.trim()),
    credentials: true,
  });

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Auth server listening on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to bootstrap auth server:', err);
  process.exit(1);
});
