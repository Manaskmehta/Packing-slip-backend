import { Module } from '@nestjs/common';
import { PackingSlipService } from './packing-slip.service';
import { PackingSlipController } from './packing-slip.controller';

@Module({
  controllers: [PackingSlipController],
  providers: [PackingSlipService],
})
export class PackingSlipModule {}
