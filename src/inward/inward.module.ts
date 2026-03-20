import { Module } from '@nestjs/common';
import { InwardService } from './inward.service';
import { InwardController } from './inward.controller';

@Module({
  controllers: [InwardController],
  providers: [InwardService],
})
export class InwardModule {}
