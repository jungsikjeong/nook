import { Inject, Injectable } from '@nestjs/common';

import { DATABASE, type Database } from '@/db/db.service';
import { users, type ProfileRow, type User } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { profiles, type NewProfileRow } from '@/db/schema/profiles';
import { UpdateProfileInput } from '../dto/users-profile.dto';

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

  async uploadProfileImage(
    userId: string,
    filePath: string,
  ): Promise<{ imageUrl: string }> {
    const imageUrl = `/${filePath.replace(/\\/g, '/')}`;

    await this.db
      .update(profiles)
      .set({ image: imageUrl })
      .where(eq(profiles.userId, userId));

    return { imageUrl };
  }

  async updateProfile({ updateDto }: { updateDto: UpdateProfileInput }): Promise<ProfileRow | null> {
    const { userId, file, ...rest } = updateDto;

    const updateData: Partial<NewProfileRow> = { ...rest };

    if (file) {
      updateData.image = `/${file.path.replace(/\\/g, '/')}`;
    }

    await this.db
      .update(profiles)
      .set(updateData)
      .where(eq(profiles.userId, userId));

    return this.getProfileByUserId(userId);
  }
}
