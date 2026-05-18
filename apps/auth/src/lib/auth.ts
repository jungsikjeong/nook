import { oauthProvider } from '@better-auth/oauth-provider';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { jwt } from 'better-auth/plugins';
import { db } from '../database/client';
import * as schema from '../database/schema';

const webUrl = process.env.WEB_URL ?? 'http://localhost:3000';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3001',
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    jwt(),
    oauthProvider({
      loginPage: `${webUrl}/login`,
      consentPage: `${webUrl}/consent`,
      scopes: ['openid', 'profile', 'email', 'offline_acc봐ess'],
      allowDynamicClientRegistration: false,
    }),
  ],
});

export type Auth = typeof auth;
