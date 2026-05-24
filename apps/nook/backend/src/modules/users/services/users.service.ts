import { Inject, Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';

import { DATABASE, type Database } from '@/db/db.service';
import { profiles, users, type ProfileRow, type User } from '@/db/schema';
import { plainToClass } from 'class-transformer';
import { UserResDto } from '../dto/users-res-dto';
import { ProfileInitializationFailedError } from '../errors/profile-initialization-failed.error';

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async findById(id: string): Promise<User | null> {
    const [row] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return row ?? null;
  }

  async ensureProfile(userId: string): Promise<ProfileRow> {
    const [inserted] = await this.db
      .insert(profiles)
      .values({ userId })
      .onConflictDoNothing({ target: profiles.userId })
      .returning();

    if (inserted) {
      return inserted;
    }

    const [existing] = await this.db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (!existing) {
      throw new ProfileInitializationFailedError(userId);
    }

    return existing;
  }

  async findByIdWithProfile(id: string): Promise<UserResDto | null> {
    const [row] = await this.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified,
        image: profiles.image ?? users.image,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        profileUserId: profiles.userId,
        nickname: profiles.nickname,
        bio: profiles.bio,
        profileCreatedAt: profiles.createdAt,
        profileUpdatedAt: profiles.updatedAt,
      })
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(eq(users.id, id))
      .limit(1);

    if (!row) {
      return null;
    }

    const profile = row.profileUserId
      ? {
          userId: row.profileUserId,
          nickname: row.nickname,
          image: row.image ?? [],
          bio: row.bio,
          createdAt: row.profileCreatedAt ?? row.createdAt,
          updatedAt: row.profileUpdatedAt ?? row.updatedAt,
        }
      : await this.ensureProfile(row.id);

    return plainToClass(
      UserResDto,
      {
        id: row.id,
        name: row.name,
        email: row.email,
        emailVerified: row.emailVerified,
        image: row.image,
        role: row.role,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        nickname: profile.nickname,
        profile,
      },
      { excludeExtraneousValues: true },
    );
  }

  async listAll(): Promise<UserResDto[]> {
    const rows = await this.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified,
        image: profiles.image ?? users.image,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        profileUserId: profiles.userId,
        nickname: profiles.nickname,
        bio: profiles.bio,
        profileCreatedAt: profiles.createdAt,
        profileUpdatedAt: profiles.updatedAt,
      })
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .orderBy(desc(users.createdAt));

    return plainToClass(
      UserResDto,
      rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        emailVerified: row.emailVerified,
        image: row.image,
        role: row.role,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        nickname: row.nickname,
        profile: row.profileUserId
          ? {
              userId: row.profileUserId,
              nickname: row.nickname,
              bio: row.bio,
              createdAt: row.profileCreatedAt,
              updatedAt: row.profileUpdatedAt,
            }
          : null,
      })),
      { excludeExtraneousValues: true },
    );
  }
}
