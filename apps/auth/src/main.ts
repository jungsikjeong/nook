import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const corsOrigin =
    config.get<string>('CORS_ORIGIN') ?? 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin.split(',').map((s) => s.trim()),
    credentials: true,
  });

  const port = config.get<number>('PORT') ?? 3002;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Auth server listening on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to bootstrap auth server:', err);
  process.exit(1);
});
