import { IsString, MaxLength, MinLength } from "class-validator";

export class SignInDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  login_id!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  password!: string;
}
