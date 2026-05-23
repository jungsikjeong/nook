import { Body, Controller, GoneException, Post } from '@nestjs/common';
import {
  AppLogger,
  Public,
  ReqContext,
  RequestContext,
} from '@nook/nest-common';

import { SignUpDto } from '../dto/sign-up.dto';
import { LegacySignupDisabledError } from '../errors/legacy-signup-disabled.error';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Post('signup')
  @Public()
  async signup(@ReqContext() ctx: RequestContext, @Body() input: SignUpDto) {
    this.logger.log(ctx, `${this.signup.name} was called`);
    try {
      await this.authService.signUp(ctx, input);
    } catch (error) {
      if (error instanceof LegacySignupDisabledError) {
        throw new GoneException(error.message);
      }

      throw error;
    }
  }
}
