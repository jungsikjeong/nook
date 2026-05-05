import { UsersService } from '@/modules/users/services/users.service';
import { Public } from '@/shared/decorators/public.decorator';
import { AppLogger } from '@/shared/logger/logger.service';
import { ReqContext } from '@/shared/request-context/req-context.decorator';
import { RequestContext } from '@/shared/request-context/request-context.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from '../dto/sign-up.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Post('signup')
  @Public()
  async signup(@ReqContext() ctx: RequestContext, @Body() input: SignUpDto) {
    this.logger.log(ctx, `${this.signup.name} was called`);
    await this.authService.signup(ctx, input);
  }
}
