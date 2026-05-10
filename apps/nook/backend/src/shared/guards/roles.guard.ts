import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type Role, ROLES_KEY } from '@nook/nest-common';

import { JwtPayload } from '@/modules/auth/strategies/jwt.strategy';
import { UsersService } from '@/modules/users/services/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly users: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    const payload = request.user;
    if (!payload) {
      throw new ForbiddenException('Authentication required');
    }

    const dbUser = await this.users.findById(payload.sub);
    if (!dbUser || !requiredRoles.includes(dbUser.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}
