import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { validateEnv } from './config/env.validation';
import { DbModule } from './db/db.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BetterAuthGuard } from './shared/guards/better-auth.guard';
import { RolesGuard } from './shared/guards/roles.guard';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
    }),
    SharedModule,
    DbModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: BetterAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
