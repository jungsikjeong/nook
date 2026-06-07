import { Inject, Injectable } from '@nestjs/common';

import { DATABASE, type Database } from '@/db/db.service';
import { users, type ProfileRow, type User } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { profiles } from '@/db/schema/profiles';

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async findById(userId: string): Promise<User | null> {
    const result = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    return result ?? null;
  }

  async getProfileByUserId(userId: string): Promise<ProfileRow | null> {
    const result = await this.db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });
    return result ?? null;
  }
}
