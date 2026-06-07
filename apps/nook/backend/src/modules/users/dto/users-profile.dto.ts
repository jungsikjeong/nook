import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

/**
 * 닉네임 허용 문자: 한글(완성형) / 영문 / 숫자 / 밑줄.
 * DB CHECK 제약(`^[가-힣a-zA-Z0-9_]{2,20}$`)과 동일한 규칙을 앱 단에서도 검증한다.
 */
const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9_]+$/;

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateProfileDto {
  @Transform(trim)
  @IsString()
  @Length(2, 20, { message: '닉네임은 2~20자여야 합니다.' })
  @Matches(NICKNAME_REGEX, {
    message: '닉네임은 한글, 영문, 숫자, _ 만 사용할 수 있어요.',
  })
  nickname: string;

  @IsOptional()
  @IsString()
  @MaxLength(160, { message: '소개는 160자 이하여야 합니다.' })
  bio?: string;
}

export type UpdateProfileInput = UpdateProfileDto & {
  userId: string;
  file?: Express.Multer.File;
};

export class UpdateProfileDto {
  @IsOptional()
  @Transform(trim)
  @IsString()
  @Length(2, 20, { message: '닉네임은 2~20자여야 합니다.' })
  @Matches(NICKNAME_REGEX, {
    message: '닉네임은 한글, 영문, 숫자, _ 만 사용할 수 있어요.',
  })
  nickname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160, { message: '소개는 160자 이하여야 합니다.' })
  bio?: string;
}
