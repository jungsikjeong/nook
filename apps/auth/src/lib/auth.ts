import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { oauthProvider } from '@better-auth/oauth-provider';
import { db } from '../database/client';

const authServerUrl = process.env.BETTER_AUTH_URL ?? 'http://localhost:3001';
const authWebUrl = process.env.WEB_URL ?? 'http://localhost:3000';
const oidcScopes = ['openid', 'profile', 'email', 'offline_access'];

const corsOrigins = (process.env.CORS_ORIGIN ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const trustedOrigins = [
  ...new Set([authServerUrl, authWebUrl, ...corsOrigins]),
];

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  trustedOrigins,
  emailAndPassword: { enabled: true },
  disabledPaths: ['/token'],
  plugins: [
    jwt({
      jwks: {
        keyPairConfig: { alg: 'RS256' },
      },
    }),
    oauthProvider({
      loginPage: `${authWebUrl}/signin`,
      consentPage: `${authWebUrl}/consent`,
      signup: {
        page: `${authWebUrl}/signup`,
      },
      scopes: oidcScopes,
      clientRegistrationDefaultScopes: oidcScopes,
      clientRegistrationAllowedScopes: oidcScopes,
      allowDynamicClientRegistration: false,
      silenceWarnings: {
        oauthAuthServerConfig: true,
        openidConfig: true,
      },
    }),
  ],
});
