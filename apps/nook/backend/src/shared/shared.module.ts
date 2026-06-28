import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import {
  AllExceptionsFilter,
  AppLoggerModule,
  LoggingInterceptor,
} from '@nook/nest-common';

import { Env } from '../config/env.validation';

@Module({
  imports: [
    AppLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => {
        const nodeEnv = config.get('NODE_ENV', { infer: true });
        const isProd = nodeEnv === 'production';
        return {
          level: config.get('LOG_LEVEL', { infer: true }),
          isProd,
          appName: 'Nook',
        };
      },
    }),
  ],
  exports: [AppLoggerModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class SharedModule {}
