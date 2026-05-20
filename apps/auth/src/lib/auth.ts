import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { oauthProvider } from '@better-auth/oauth-provider';
import { db } from '../database/client';

// 이 IdP 에 cross-origin 으로 호출 가능한 RP/UI 의 origin 목록.
// CORS_ORIGIN (NestJS CORS 용) 과 동일한 값을 재사용해서 일치 유지.
const trustedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  trustedOrigins,
  emailAndPassword: { enabled: true },
  silenceWarnings: {
    oauthAuthServerConfig: true,
  },
  disabledPaths: ['/token'],
  plugins: [
    jwt({
      jwks: {
        keyPairConfig: { alg: 'RS256' },
      },
    }),
    oauthProvider({
      loginPage: '/signin',
      consentPage: '/consent',
      // ...other options
    }),
  ],
});
