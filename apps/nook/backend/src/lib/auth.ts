import 'dotenv/config';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { genericOAuth } from 'better-auth/plugins/generic-oauth';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { account, session, users, verification } from '@/db/schema/auth';

const providerId = process.env.OIDC_PROVIDER_ID ?? 'nook-auth';
const port = process.env.PORT ?? '4000';
const rpBaseUrl = process.env.BETTER_AUTH_URL ?? `http://localhost:${port}`;
const oidcIssuer = process.env.OIDC_ISSUER ?? 'http://localhost:3001/api/auth';
const discoveryUrl =
  process.env.OIDC_DISCOVERY_URL ??
  `${oidcIssuer}/.well-known/openid-configuration`;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

const authSecret = process.env.BETTER_AUTH_SECRET ?? process.env.SESSION_SECRET;
if (!authSecret) {
  throw new Error('BETTER_AUTH_SECRET or SESSION_SECRET is not set');
}

const clientId = process.env.OIDC_CLIENT_ID;
if (!clientId) {
  throw new Error('OIDC_CLIENT_ID is not set');
}

const clientSecret = process.env.OIDC_CLIENT_SECRET;
if (!clientSecret) {
  throw new Error('OIDC_CLIENT_SECRET is not set');
}

const trustedOrigins = [
  ...new Set([
    rpBaseUrl,
    ...(process.env.CORS_ORIGIN ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  ]),
];

const sql = postgres(databaseUrl, { max: 10 });
const db = drizzle(sql);

export const oauthProviderId = providerId;
export const oauthCallbackUrl = `${rpBaseUrl}/api/auth/oauth2/callback/${providerId}`;

export const auth = betterAuth({
  appName: 'Nook',
  baseURL: rpBaseUrl,
  secret: authSecret,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: { user: users, session, account, verification },
  }),
  trustedOrigins,
  emailAndPassword: {
    enabled: false,
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId,
          clientId,
          clientSecret,
          discoveryUrl,
          issuer: oidcIssuer,
          requireIssuerValidation: true,
          scopes: ['openid', 'email', 'profile', 'offline_access'],
          pkce: true,
          overrideUserInfo: true,
        },
      ],
    }),
  ],
});
