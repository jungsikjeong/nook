import {
  index,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const oidcPayloads = pgTable(
  'oidc_payloads',
  {
    id: text('id').notNull(),
    model: text('model').notNull(),
    payload: jsonb('payload').$type<Record<string, any>>().notNull(),
    grantId: text('grant_id'),
    userCode: text('user_code'),
    uid: text('uid'),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.model, t.id] }),
    grantIdx: index('idx_oidc_grant').on(t.grantId),
    userCodeIdx: index('idx_oidc_user_code').on(t.userCode),
    uidIdx: index('idx_oidc_uid').on(t.uid),
    expiresIdx: index('idx_oidc_expires').on(t.expiresAt),
  }),
);
