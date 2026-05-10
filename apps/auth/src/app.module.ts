import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import {
  AllExceptionsFilter,
  AppLoggerModule,
  LoggingInterceptor,
} from '@nook/nest-common';
import { OidcModule } from 'nest-oidc-provider';

import { HealthController } from './health.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { InteractionModule } from './modules/oidc/interaction/interaction.module';
import { OidcConfigModule } from './modules/oidc/config/oidc-config.module';
import { OidcConfigService } from './modules/oidc/config/oidc-config.service';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AppLoggerModule.forRoot({
      isProd: process.env.NODE_ENV === 'production',
      level: process.env.LOG_LEVEL,
      appName: 'Auth',
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    OidcModule.forRootAsync({
      imports: [OidcConfigModule],
      useExisting: OidcConfigService,
    }),
    InteractionModule,
  ],

  controllers: [HealthController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
