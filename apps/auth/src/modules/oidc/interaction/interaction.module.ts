import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { InteractionController } from './interaction.controller';

@Module({
  imports: [AuthModule],
  controllers: [InteractionController],
})
export class InteractionModule {}
