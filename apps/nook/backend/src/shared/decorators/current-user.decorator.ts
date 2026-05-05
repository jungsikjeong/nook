import {
  createParamDecorator,
  InternalServerErrorException,
  type ExecutionContext,
} from '@nestjs/common';

import { JwtPayload } from '@/modules/auth/strategies/jwt.strategy';

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<{ user?: JwtPayload }>();
    if (!request.user) {
      throw new InternalServerErrorException(
        '@CurrentUser was used without auth guard',
      );
    }
    return request.user;
  },
);
