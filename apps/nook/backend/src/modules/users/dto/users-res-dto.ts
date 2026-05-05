import { Expose, Type } from 'class-transformer';

class ProfileResDto {
  @Expose() id: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() userId: string;
  @Expose() profileImageUrls: string[];
  @Expose() bio: string | null;
}

export class UserResDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() loginId: string;
  @Expose() nickname: string;
  @Expose() email: string;
  @Expose() role: 'USER' | 'ADMIN';
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;

  @Expose()
  @Type(() => ProfileResDto)
  profile: ProfileResDto;
}
