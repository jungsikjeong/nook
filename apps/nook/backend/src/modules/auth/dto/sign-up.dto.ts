import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ROLE } from '../constants/role.constant';

export class SignUpDto {
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_.-]+$/, {
    message: 'login_id는 영문/숫자/_/./-만 사용할 수 있습니다.',
  })
  loginId: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9가-힣_.-]+$/, {
    message: 'nickname은 한글/영문/숫자/_/./-만 사용할 수 있습니다.',
  })
  nickname: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  // 이 키들은 ADMIN 사용자만 설정할 수 있음.
  roles: ROLE[] = [ROLE.USER];
}
