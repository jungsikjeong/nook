import { User } from '@/db/schema';
import {
  AuthenticatedUser,
  CurrentUser,
} from '@/shared/decorators/current-user.decorator';
import { Controller, Get } from '@nestjs/common';
import { NotFoundError } from '@nook/nest-common';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async findById(@CurrentUser() user: AuthenticatedUser): Promise<User> {
    const userInfo = await this.usersService.findById(user.sub);

    if (!userInfo) throw new NotFoundError('User not found');

    return userInfo;
  }

  @Get('me/profile')
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return await this.usersService.getProfileByUserId(user.sub);
  }
}
