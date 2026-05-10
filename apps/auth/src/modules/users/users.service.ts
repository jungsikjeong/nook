import { Inject, Injectable } from '@nestjs/common';
import { ConflictError } from '@nook/nest-common';
import { eq } from 'drizzle-orm';
import { DATABASE, type Database } from '../../database/database.module';
import {
  users,
  UserWithoutPassword,
  type User,
} from '../../database/schema/schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async findById(id: string): Promise<User | undefined> {
    const [row] = await this.db.select().from(users).where(eq(users.id, id));
    return row;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const [row] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return row;
  }

  async create(input: CreateUserDto): Promise<UserWithoutPassword> {
    const existing = await this.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('Email already in use');
    }

    const [row] = await this.db.insert(users).values(input).returning();
    const { passwordHash: _ph, ...user } = row;
    return user as UserWithoutPassword;
  }
}
