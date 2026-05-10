import { Module } from '@nestjs/common';
import { UsersModule } from '../../users/users.module';
import { DatabaseModule } from '../db/database.module';
import { OidcConfigService } from './oidc-config.service';

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [OidcConfigService],
  exports: [OidcConfigService],
})
export class OidcConfigModule {}
