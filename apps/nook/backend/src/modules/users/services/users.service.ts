import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { eq, or } from 'drizzle-orm';

import { DATABASE, type Database } from '@/db/db.service';
import { profiles, type User, users } from '@/db/schema';
import { plainToClass } from 'class-transformer';
import { UserResDto } from '../dto/users-res-dto';

export interface CreateUserInput {
  loginId: string;
  passwordHash: string;
  name: string;
  nickname: string;
  email: string;
}

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async findByLoginId(loginId: string): Promise<User | null> {
    const [row] = await this.db
      .select()
      .from(users)
      .where(eq(users.loginId, loginId))
      .limit(1);
    return row ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const [row] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return row ?? null;
  }

  async findByIdWithProfile(id: string): Promise<UserResDto | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, id),
      with: { profile: true },
    });
    return plainToClass(UserResDto, user, { excludeExtraneousValues: true });
  }

  async createWithProfile(input: CreateUserInput): Promise<User> {
    return this.db.transaction(async (tx) => {
      const conflict = await tx
        .select({
          id: users.id,
          loginId: users.loginId,
          email: users.email,
          nickname: users.nickname,
        })
        .from(users)
        .where(
          or(
            eq(users.loginId, input.loginId),
            eq(users.email, input.email),
            eq(users.nickname, input.nickname),
          ),
        )
        .limit(1);

      if (conflict.length > 0) {
        const existing = conflict[0];
        if (existing.loginId === input.loginId) {
          throw new ConflictException('이미 사용 중인 로그인 아이디입니다.');
        }
        if (existing.nickname === input.nickname) {
          throw new ConflictException('이미 사용 중인 닉네임입니다.');
        }
        throw new ConflictException('이미 사용 중인 이메일입니다.');
      }

      const [user] = await tx
        .insert(users)
        .values({
          loginId: input.loginId,
          password: input.passwordHash,
          name: input.name,
          nickname: input.nickname,
          email: input.email,
        })
        .returning();

      await tx.insert(profiles).values({
        userId: user.id,
      });

      return user;
    });
  }

  async findByNickname(nickname: string): Promise<User | null> {
    const [row] = await this.db
      .select()
      .from(users)
      .where(eq(users.nickname, nickname))
      .limit(1);
    return row ?? null;
  }

  async listAll(): Promise<UserResDto[]> {
    const users = await this.db.query.users.findMany({
      with: { profile: true },
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    });

    return plainToClass(UserResDto, users, { excludeExtraneousValues: true });
  }
}
