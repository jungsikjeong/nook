import 'dotenv/config';

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

import { AppModule } from '../src/app.module';

/**
 * OpenAPI 스펙(openapi.json)을 파일로 추출한다.
 *
 * - `preview: true` 로 앱을 생성하면 컨트롤러/프로바이더를 인스턴스화하지 않으므로
 *   DB 연결 등 부작용 없이 라우트 메타데이터만 스캔한다.
 * - `setGlobalPrefix('api')` 는 런타임(main.ts)과 동일하게 맞춰 경로를 일치시킨다.
 * - `cleanupOpenApiDoc` 은 nestjs-zod DTO에서 생성된 스키마를 후처리한다.
 */
async function generateOpenApi(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    preview: true,
    logger: false,
  });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Nook API')
    .setDescription('Nook 백엔드 OpenAPI 스펙')
    .setVersion('0.1.0')
    .addCookieAuth('better-auth.session_token')
    .build();

  const document = cleanupOpenApiDoc(SwaggerModule.createDocument(app, config));

  const outPath = join(__dirname, '..', 'openapi.json');
  writeFileSync(outPath, `${JSON.stringify(document, null, 2)}\n`);

  await app.close();

  console.log(`✅ OpenAPI 스펙을 생성했습니다: ${outPath}`);
}

generateOpenApi().catch((err) => {
  console.error('❌ OpenAPI 스펙 생성 실패:', err);
  process.exit(1);
});
