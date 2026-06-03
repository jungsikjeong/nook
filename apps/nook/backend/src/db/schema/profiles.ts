import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { users } from './auth';

export const profiles = pgTable('profiles', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  nickname: varchar('nickname', { length: 20 }).unique(),
  image: text('image')
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  bio: text('bio'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  },
);

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export type ProfileRow = typeof profiles.$inferSelect;
export type NewProfileRow = typeof profiles.$inferInsert;
