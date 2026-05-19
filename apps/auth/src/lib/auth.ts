import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { oauthProvider } from '@better-auth/oauth-provider';
import { db } from '../database/client';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
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
