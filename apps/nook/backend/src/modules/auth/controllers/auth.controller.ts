import { Controller } from '@nestjs/common';
import { AppLogger } from '@nook/nest-common';

import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthController.name);
  }
}
