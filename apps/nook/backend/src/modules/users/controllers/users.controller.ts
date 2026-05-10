import { Controller, Get, NotFoundException } from '@nestjs/common';
import { Role, Roles } from '@nook/nest-common';

import { JwtPayload } from '@/modules/auth/strategies/jwt.strategy';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';

import { UserResDto } from '../dto/users-res-dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  async me(@CurrentUser() current: JwtPayload): Promise<UserResDto> {
    const user = await this.users.findByIdWithProfile(current.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get()
  @Roles(Role.ADMIN)
  async list(): Promise<UserResDto[]> {
    return await this.users.listAll();
  }
}
