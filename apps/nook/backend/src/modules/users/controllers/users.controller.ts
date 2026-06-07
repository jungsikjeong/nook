import { User } from '@/db/schema';
import {
  AuthenticatedUser,
  CurrentUser,
} from '@/shared/decorators/current-user.decorator';
import {
  Controller,
  Get,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NotFoundError } from '@nook/nest-common';
import { createDiskStorage } from '@/shared/storage/disk.storage';
import { UsersService } from '../services/users.service';
import { UpdateProfileDto } from '../dto/users-profile.dto';

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

  @Patch('me/update-profile')
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    updateProfileDto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updateDto = {
      userId: user.sub,
      ...updateProfileDto,
      file,
    };

    return this.usersService.updateProfile({
      updateDto,
    });
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: createDiskStorage('./uploads/profile'),
    }),
  )
  @Post('me/profile/image')
  uploadProfileImage(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /jpeg|png|webp/ })
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return this.usersService.uploadProfileImage(user.sub, file.path);
  }
}
