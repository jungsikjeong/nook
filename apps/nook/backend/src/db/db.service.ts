import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';

import * as schema from './schema';

export const DATABASE = Symbol('DATABASE');

export type Database = PostgresJsDatabase<typeof schema>;
export type DrizzleTx = Parameters<Parameters<Database['transaction']>[0]>[0];

@Injectable()
export class DbService implements OnModuleDestroy {
  private readonly logger = new Logger(DbService.name);
  private readonly client: Sql;
  public readonly db: Database;

  constructor(private readonly config: ConfigService) {
    const connectionString = this.config.getOrThrow<string>('DATABASE_URL');
    this.client = postgres(connectionString);
    this.db = drizzle(this.client, { schema });
    this.logger.log('Database connection pool initialized');
  }

  async onModuleDestroy(): Promise<void> {
    await this.client?.end();
    this.logger.log('Database connection pool closed');
  }
}
