import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AppLogger, RequestContext } from '@nook/nest-common';
import * as bcrypt from 'bcrypt';

import { Database, DATABASE } from '@/db/db.service';
import type { SignUpDto } from '@/modules/auth/dto/sign-up.dto';
import { UsersService } from '@/modules/users/services/users.service';

import { ROLE } from '../constants/role.constant';

const BCRYPT_ROUNDS = 12;
const REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,

    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async signUp(ctx: RequestContext, input: SignUpDto) {
    this.logger.log(ctx, `${this.signUp.name} was called`);

    // TODO: 여기서 기본 역할을 USER로 설정하고 있음. 추후 ADMIN 사용자가 변경할 수 있는 옵션 추가 예정.
    input.roles = [ROLE.USER];

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const user = await this.users.createWithProfile({
      loginId: input.login_id,
      passwordHash,
      name: input.name,
      nickname: input.nickname,
      email: input.email,
    });
    return {
      sub: user.id,
    };
  }
}
