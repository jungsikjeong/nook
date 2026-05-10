import { Injectable } from '@nestjs/common';
import { UnauthorizedError } from '@nook/nest-common';
import bcrypt from 'bcryptjs';
import { UserWithoutPassword, type User } from '../../database/schema/schema';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signup.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(dto: SignUpDto): Promise<UserWithoutPassword> {
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    return this.usersService.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
    });
  }

  async authenticate(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await this.verifyPassword(password, user.passwordHash))) {
      throw new UnauthorizedError('Invalid credentials');
    }
    return user;
  }

  private async verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
