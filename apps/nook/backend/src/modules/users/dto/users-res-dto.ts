import { Expose, Type } from 'class-transformer';

class ProfileResDto {
  @Expose() userId: string;
  @Expose() nickname: string | null;
  @Expose() profileImageUrls: string[];
  @Expose() bio: string | null;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}

export class UserResDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() email: string;
  @Expose() emailVerified: boolean;
  @Expose() image: string | null;
  @Expose() nickname: string | null;
  @Expose() role: 'USER' | 'ADMIN';
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;

  @Expose()
  @Type(() => ProfileResDto)
  profile: ProfileResDto | null;
}
