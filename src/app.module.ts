import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { InwardModule } from './inward/inward.module';
import { PackingSlipModule } from './packing-slip/packing-slip.module';
import { StockModule } from './stock/stock.module';
import { MastersModule } from './masters/masters.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    InwardModule,
    PackingSlipModule,
    StockModule,
    MastersModule,
  ],
})
export class AppModule {}
