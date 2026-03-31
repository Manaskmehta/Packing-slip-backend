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
  findAll(
    @Query()
    query: {
      search?: string;
      page?: string;
      limit?: string;
      sortBy?: string;
      sortDir?: string;
      partyId?: string;
      projectId?: string;
      productId?: string;
      year?: string;
      isLocked?: string;
    },
  ) {
    const dir = query.sortDir === 'asc' || query.sortDir === 'desc' ? query.sortDir : undefined;
    const pid = query.partyId ? Number(query.partyId) : undefined;
    const prid = query.projectId ? Number(query.projectId) : undefined;
    const prodId = query.productId ? Number(query.productId) : undefined;
    const y = query.year ? Number(query.year) : undefined;
    const locked =
      query.isLocked === 'true' ? true : query.isLocked === 'false' ? false : undefined;
    return this.packingSlip.findAll({
      search: query.search,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 50,
      sortBy: query.sortBy,
      sortDir: dir,
      partyId: pid != null && Number.isFinite(pid) ? pid : undefined,
      projectId: prid != null && Number.isFinite(prid) ? prid : undefined,
      productId: prodId != null && Number.isFinite(prodId) ? prodId : undefined,
      year: y != null && Number.isFinite(y) ? y : undefined,
      isLocked: locked,
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
