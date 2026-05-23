import { Injectable } from '@nestjs/common';
import { AppLogger, RequestContext } from '@nook/nest-common';

import type { SignUpDto } from '@/modules/auth/dto/sign-up.dto';
import { LegacySignupDisabledError } from '../errors/legacy-signup-disabled.error';

@Injectable()
export class AuthService {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(AuthService.name);
  }

  async signUp(ctx: RequestContext, _input: SignUpDto) {
    this.logger.log(ctx, `${this.signUp.name} was called`);

    throw new LegacySignupDisabledError();
  }
}
