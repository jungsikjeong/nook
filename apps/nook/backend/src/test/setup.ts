import * as schema from '@/db/schema';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

export type TestDb = {
  db: NodePgDatabase<typeof schema>;
  cleanup: () => Promise<void>;
};

// todo: rest-api-nestjs 보고서 여기 수정할것

export async function createTestDb(): Promise<TestDb> {
  const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });

  await pool.query('DROP SCHEMA IF EXISTS public CASCADE');
  await pool.query('DROP SCHEMA IF EXISTS drizzle CASCADE');
  await pool.query('CREATE SCHEMA public');

  const db = drizzle(pool, { schema });
  await migrate(db, { migrationsFolder: './drizzle' });

  return {
    db,
    cleanup: async () => {
      await pool.end();
    },
  };
}
