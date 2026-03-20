import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('stock')
export class StockController {
  constructor(private stock: StockService) {}

  @Get()
  getCurrentStock(@Query('search') search?: string) {
    return this.stock.getCurrentStock(search);
  }

  @Get('dashboard')
  getDashboard() {
    return this.stock.getDashboardStats();
  }
}
