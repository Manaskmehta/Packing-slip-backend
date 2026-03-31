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
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { InwardService } from './inward.service';
import { CreateInwardDto, UpdateInwardDto } from './dto/inward.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('inward')
export class InwardController {
  constructor(private inward: InwardService) {}

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
      poId?: string;
      year?: string;
    },
  ) {
    const dir = query.sortDir === 'asc' || query.sortDir === 'desc' ? query.sortDir : undefined;
    const pid = query.partyId ? Number(query.partyId) : undefined;
    const prid = query.projectId ? Number(query.projectId) : undefined;
    const prodId = query.productId ? Number(query.productId) : undefined;
    const po = query.poId ? Number(query.poId) : undefined;
    const y = query.year ? Number(query.year) : undefined;
    return this.inward.findAll({
      search: query.search,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 50,
      sortBy: query.sortBy,
      sortDir: dir,
      partyId: pid != null && Number.isFinite(pid) ? pid : undefined,
      projectId: prid != null && Number.isFinite(prid) ? prid : undefined,
      productId: prodId != null && Number.isFinite(prodId) ? prodId : undefined,
      poId: po != null && Number.isFinite(po) ? po : undefined,
      year: y != null && Number.isFinite(y) ? y : undefined,
    });
  }

  @Get('challans')
  getChallans(
    @Query('partyId') partyId?: string,
    @Query('projectId') projectId?: string,
    @Query('poId') poId?: string,
  ) {
    return this.inward.getChallans({
      partyId: partyId ? Number(partyId) : undefined,
      projectId: projectId ? Number(projectId) : undefined,
      poId: poId ? Number(poId) : undefined,
    });
  }

  @Get('po-items')
  getPoItems(
    @Query('partyId') partyId?: string,
    @Query('projectId') projectId?: string,
    @Query('poId') poId?: string,
  ) {
    return this.inward.getPoItems({
      partyId: partyId ? Number(partyId) : undefined,
      projectId: projectId ? Number(projectId) : undefined,
      poId: poId ? Number(poId) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inward.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateInwardDto, @Request() req) {
    return this.inward.create(dto, req.user.id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInwardDto) {
    return this.inward.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: { user: { role: string } }) {
    return this.inward.remove(id, req.user.role);
  }

  @Post('import/preview')
  @UseInterceptors(FileInterceptor('file'))
  previewImport(@UploadedFile() file: Express.Multer.File) {
    return this.inward.previewExcel(file.buffer);
  }

  @Post('import/confirm')
  @UseInterceptors(FileInterceptor('file'))
  confirmImport(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.inward.importFromExcel(file.buffer, req.user.id);
  }

  @Get('template/download')
  downloadTemplate(@Res() res: Response) {
    const buffer = this.inward.generateTemplate();
    res.setHeader('Content-Disposition', 'attachment; filename="inward_template.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  }
}
