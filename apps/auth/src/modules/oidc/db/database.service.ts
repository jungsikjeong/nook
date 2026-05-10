import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gt, sql } from 'drizzle-orm';
import {
  DATABASE,
  type Database,
} from '../../../database/database.module';
import { oidcPayloads } from '../../../database/schema/oidc';

@Injectable()
export class DatabaseService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async upsert(
    model: string,
    id: string,
    payload: Record<string, any>,
    expiresIn: number,
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    const { grantId, userCode, uid } = payload;

    await this.db
      .insert(oidcPayloads)
      .values({
        model,
        id,
        payload,
        grantId: grantId ?? null,
        userCode: userCode ?? null,
        uid: uid ?? null,
        expiresAt,
      })
      .onConflictDoUpdate({
        target: [oidcPayloads.model, oidcPayloads.id],
        set: {
          payload,
          grantId: grantId ?? null,
          userCode: userCode ?? null,
          uid: uid ?? null,
          expiresAt,
        },
      });
  }

  async find(
    model: string,
    id: string,
  ): Promise<Record<string, any> | undefined> {
    const [row] = await this.db
      .select({ payload: oidcPayloads.payload })
      .from(oidcPayloads)
      .where(
        and(
          eq(oidcPayloads.model, model),
          eq(oidcPayloads.id, id),
          gt(oidcPayloads.expiresAt, new Date()),
        ),
      );
    return row?.payload;
  }

  async findByUid(model: string, uid: string) {
    const [row] = await this.db
      .select({ payload: oidcPayloads.payload })
      .from(oidcPayloads)
      .where(
        and(
          eq(oidcPayloads.model, model),
          eq(oidcPayloads.uid, uid),
          gt(oidcPayloads.expiresAt, new Date()),
        ),
      );
    return row?.payload;
  }

  async findByUserCode(model: string, userCode: string) {
    const [row] = await this.db
      .select({ payload: oidcPayloads.payload })
      .from(oidcPayloads)
      .where(
        and(
          eq(oidcPayloads.model, model),
          eq(oidcPayloads.userCode, userCode),
          gt(oidcPayloads.expiresAt, new Date()),
        ),
      );
    return row?.payload;
  }

  async consume(model: string, id: string): Promise<void> {
    await this.db
      .update(oidcPayloads)
      .set({
        payload: sql`jsonb_set(${oidcPayloads.payload}, '{consumed}', to_jsonb(extract(epoch from now())::bigint))`,
      })
      .where(and(eq(oidcPayloads.model, model), eq(oidcPayloads.id, id)));
  }

  async delete(model: string, id: string): Promise<void> {
    await this.db
      .delete(oidcPayloads)
      .where(and(eq(oidcPayloads.model, model), eq(oidcPayloads.id, id)));
  }

  async revokeByGrantId(grantId: string): Promise<void> {
    await this.db
      .delete(oidcPayloads)
      .where(eq(oidcPayloads.grantId, grantId));
  }

  async cleanupExpired(): Promise<void> {
    await this.db
      .delete(oidcPayloads)
      .where(sql`${oidcPayloads.expiresAt} < now()`);
  }
}
