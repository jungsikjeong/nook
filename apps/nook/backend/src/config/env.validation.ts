import { z } from 'zod';

export const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    PORT: z.coerce.number().int().positive().default(4000),
    DATABASE_URL: z.string().url().or(z.string().startsWith('postgres')),
    JWT_SECRET: z
      .string()
      .min(16, 'JWT_SECRET must be at least 16 characters')
      .optional(),
    JWT_EXPIRES_IN: z.string().optional(),
    BETTER_AUTH_SECRET: z
      .string()
      .min(32, 'BETTER_AUTH_SECRET must be at least 32 characters')
      .optional(),
    BETTER_AUTH_URL: z.string().url().default('http://localhost:4000'),
    SESSION_SECRET: z
      .string()
      .min(32, 'SESSION_SECRET must be at least 32 characters')
      .optional(),
    OIDC_ISSUER: z.string().url().default('http://localhost:3001/api/auth'),
    OIDC_DISCOVERY_URL: z.string().url().optional(),
    OIDC_PROVIDER_ID: z.string().default('nook-auth'),
    OIDC_CLIENT_ID: z.string().min(1, 'OIDC_CLIENT_ID is required'),
    OIDC_CLIENT_SECRET: z.string().min(1, 'OIDC_CLIENT_SECRET is required'),
    OIDC_CALLBACK_URL: z.string().url().optional(),
    COOKIE_DOMAIN: z.string().default('localhost'),
    COOKIE_SECURE: z
      .union([z.boolean(), z.string()])
      .transform((value) =>
        typeof value === 'boolean' ? value : value === 'true',
      )
      .default(false),
    CORS_ORIGIN: z.string().default('http://localhost:3030'),
    LOG_LEVEL: z
      .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
      .optional(),
  })
  .refine((env) => env.BETTER_AUTH_SECRET || env.SESSION_SECRET, {
    message: 'BETTER_AUTH_SECRET or SESSION_SECRET is required',
    path: ['BETTER_AUTH_SECRET'],
  });

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  return result.data;
}
