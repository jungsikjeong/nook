import { defineConfig } from '@hey-api/openapi-ts';

/**
 * 백엔드(@nook/backend)가 `pnpm openapi:gen`으로 만든 openapi.json을 읽어
 * 프론트에서 공유할 타입을 생성한다.
 *
 * BFF 패턴(서버 전용 fetch + 쿠키 포워딩, `src/lib/api/server.ts`)을 유지하기
 * 위해 SDK/HTTP 클라이언트는 생성하지 않고 타입만 생성한다.
 */
export default defineConfig({
  input: '../backend/openapi.json',
  output: {
    path: 'src/lib/api/generated',
    postProcess: ['prettier'],
  },
  plugins: ['@hey-api/typescript'],
});
