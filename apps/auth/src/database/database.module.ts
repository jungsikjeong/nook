import {
  Global,
  Inject,
  Injectable,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export const DATABASE = Symbol('DATABASE');
export type Database = PostgresJsDatabase<typeof schema>;

const POSTGRES_CLIENT = Symbol('POSTGRES_CLIENT');

@Injectable()
class DatabaseShutdown implements OnApplicationShutdown {
  constructor(
    @Inject(POSTGRES_CLIENT) private readonly client: postgres.Sql,
  ) {}
  async onApplicationShutdown() {
    await this.client.end({ timeout: 5 });
  }
}

@Global()
@Module({
  providers: [
    {
      provide: POSTGRES_CLIENT,
      useFactory: () => {
        const url = process.env.DATABASE_URL;
        if (!url) {
          throw new Error('DATABASE_URL is not set');
        }
        return postgres(url, { max: 10 });
      },
    },
    {
      provide: DATABASE,
      useFactory: (client: postgres.Sql): Database =>
        drizzle(client, { schema }),
      inject: [POSTGRES_CLIENT],
    },
    DatabaseShutdown,
  ],
  exports: [DATABASE],
})
export class DatabaseModule {}
