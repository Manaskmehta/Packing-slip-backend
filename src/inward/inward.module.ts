import { Module } from '@nestjs/common';
import { MastersModule } from '../masters/masters.module';
import { InwardService } from './inward.service';
import { InwardController } from './inward.controller';

@Module({
  imports: [MastersModule],
  controllers: [InwardController],
  providers: [InwardService],
})
export class InwardModule {}
