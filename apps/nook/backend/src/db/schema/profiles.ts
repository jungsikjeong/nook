import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { user } from './auth';

export const profiles = pgTable('profiles', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  nickname: text('nickname').unique(),
  profileImageUrls: text('profile_image_urls')
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
});

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(user, {
    fields: [profiles.userId],
    references: [user.id],
  }),
}));

export type ProfileRow = typeof profiles.$inferSelect;
export type NewProfileRow = typeof profiles.$inferInsert;
