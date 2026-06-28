import { Injectable } from '@nestjs/common';
import { AppLogger } from '@nook/nest-common';

@Injectable()
export class AuthService {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(AuthService.name);
  }
}
