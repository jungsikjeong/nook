import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { utilities as nestWinstonUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { Env } from '../../config/env.validation';
import { AppLogger } from './logger.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => {
        const nodeEnv = config.get('NODE_ENV', { infer: true });
        const isProd = nodeEnv === 'production';
        const configuredLevel = config.get('LOG_LEVEL', { infer: true });
        const level = configuredLevel ?? (isProd ? 'info' : 'debug');

        const devFormat = winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonUtilities.format.nestLike('Nook', {
            colors: true,
            prettyPrint: true,
          }),
        );

        const prodFormat = winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json(),
        );

        return {
          level,
          format: isProd ? prodFormat : devFormat,
          transports: [new winston.transports.Console()],
        };
      },
    }),
  ],
  providers: [AppLogger],
  exports: [AppLogger, WinstonModule],
})
export class AppLoggerModule {}
