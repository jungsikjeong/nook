import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(4)
  @MaxLength(25)
  @Matches(/^[a-zA-Z0-9_.-]+$/, {
    message: 'login_id는 영문/숫자/_/./-만 사용할 수 있습니다.',
  })
  loginId: string;

  @IsString()
  @MinLength(8)
  @MaxLength(18)
  password: string;

  @IsString()
  @MinLength(1)
  @MaxLength(10)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @Matches(/^[a-zA-Z0-9가-힣_.-]+$/, {
    message: 'nickname은 한글/영문/숫자/_/./-만 사용할 수 있습니다.',
  })
  nickname: string;

  @IsEmail()
  @MaxLength(255)
  email: string;
}
