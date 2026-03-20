import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PackingSlipService } from './packing-slip.service';
import { CreatePackingSlipDto } from './dto/packing-slip.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('packing-slips')
export class PackingSlipController {
  constructor(private packingSlip: PackingSlipService) {}

  @Get()
  findAll(@Query() query: { search?: string; page?: string; limit?: string }) {
    return this.packingSlip.findAll({
      search: query.search,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 50,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.packingSlip.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePackingSlipDto, @Request() req) {
    return this.packingSlip.create(dto, req.user.id);
  }

  @Post(':id/lock')
  lock(@Param('id', ParseIntPipe) id: number) {
    return this.packingSlip.lock(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreatePackingSlipDto) {
    return this.packingSlip.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.packingSlip.remove(id);
  }
}
