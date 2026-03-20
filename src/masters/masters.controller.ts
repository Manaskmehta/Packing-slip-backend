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
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { MastersService } from './masters.service';
import { CreatePartyDto, UpdatePartyDto } from './dto/party.dto';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CreatePoDto, UpdatePoDto } from './dto/po.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('masters')
export class MastersController {
  constructor(private masters: MastersService) {}

  // ─── Party ───────────────────────────────────────────────────────────────────

  @Get('parties')
  findAllParties(
    @Query('search') search?: string,
    @Query('activeOnly') activeOnly?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.masters.findAllParties(search, activeOnly === 'true', page ? Number(page) : 1, limit ? Number(limit) : 50);
  }

  @Get('parties/template/download')
  downloadPartyTemplate(@Res() res: Response) {
    const buffer = this.masters.generatePartyTemplate();
    res.setHeader('Content-Disposition', 'attachment; filename="parties_template.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  }

  @Post('parties/import/preview')
  @UseInterceptors(FileInterceptor('file'))
  previewPartyImport(@UploadedFile() file: Express.Multer.File) {
    return this.masters.previewPartiesExcel(file.buffer);
  }

  @Post('parties/import/confirm')
  @UseInterceptors(FileInterceptor('file'))
  confirmPartyImport(@UploadedFile() file: Express.Multer.File) {
    return this.masters.importPartiesFromExcel(file.buffer);
  }

  @Get('parties/:id')
  findOneParty(@Param('id', ParseIntPipe) id: number) {
    return this.masters.findOneParty(id);
  }

  @Post('parties')
  createParty(@Body() dto: CreatePartyDto) {
    return this.masters.createParty(dto);
  }

  @Put('parties/:id')
  updateParty(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePartyDto) {
    return this.masters.updateParty(id, dto);
  }

  @Delete('parties/:id')
  removeParty(@Param('id', ParseIntPipe) id: number) {
    return this.masters.removeParty(id);
  }

  // ─── Project ─────────────────────────────────────────────────────────────────

  @Get('projects')
  findAllProjects(
    @Query('search') search?: string,
    @Query('activeOnly') activeOnly?: string,
    @Query('partyId') partyId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.masters.findAllProjects(search, activeOnly === 'true', partyId ? Number(partyId) : undefined, page ? Number(page) : 1, limit ? Number(limit) : 50);
  }

  @Get('projects/template/download')
  downloadProjectTemplate(@Res() res: Response) {
    const buffer = this.masters.generateProjectTemplate();
    res.setHeader('Content-Disposition', 'attachment; filename="projects_template.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  }

  @Post('projects/import/preview')
  @UseInterceptors(FileInterceptor('file'))
  previewProjectImport(@UploadedFile() file: Express.Multer.File) {
    return this.masters.previewProjectsExcel(file.buffer);
  }

  @Post('projects/import/confirm')
  @UseInterceptors(FileInterceptor('file'))
  confirmProjectImport(@UploadedFile() file: Express.Multer.File) {
    return this.masters.importProjectsFromExcel(file.buffer);
  }

  @Get('projects/:id')
  findOneProject(@Param('id', ParseIntPipe) id: number) {
    return this.masters.findOneProject(id);
  }

  @Post('projects')
  createProject(@Body() dto: CreateProjectDto) {
    return this.masters.createProject(dto);
  }

  @Put('projects/:id')
  updateProject(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto) {
    return this.masters.updateProject(id, dto);
  }

  @Delete('projects/:id')
  removeProject(@Param('id', ParseIntPipe) id: number) {
    return this.masters.removeProject(id);
  }

  // ─── Product ─────────────────────────────────────────────────────────────────

  @Get('products')
  findAllProducts(
    @Query('search') search?: string,
    @Query('activeOnly') activeOnly?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.masters.findAllProducts(search, activeOnly === 'true', page ? Number(page) : 1, limit ? Number(limit) : 50);
  }

  @Get('products/template/download')
  downloadProductTemplate(@Res() res: Response) {
    const buffer = this.masters.generateProductTemplate();
    res.setHeader('Content-Disposition', 'attachment; filename="products_template.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  }

  @Post('products/import/preview')
  @UseInterceptors(FileInterceptor('file'))
  previewProductImport(@UploadedFile() file: Express.Multer.File) {
    return this.masters.previewProductsExcel(file.buffer);
  }

  @Post('products/import/confirm')
  @UseInterceptors(FileInterceptor('file'))
  confirmProductImport(@UploadedFile() file: Express.Multer.File) {
    return this.masters.importProductsFromExcel(file.buffer);
  }

  @Get('products/:id')
  findOneProduct(@Param('id', ParseIntPipe) id: number) {
    return this.masters.findOneProduct(id);
  }

  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.masters.createProduct(dto);
  }

  @Put('products/:id')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.masters.updateProduct(id, dto);
  }

  @Delete('products/:id')
  removeProduct(@Param('id', ParseIntPipe) id: number) {
    return this.masters.removeProduct(id);
  }

  // ─── PO ──────────────────────────────────────────────────────────────────────

  @Get('pos')
  findAllPos(
    @Query('search') search?: string,
    @Query('partyId') partyId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.masters.findAllPos(search, partyId ? Number(partyId) : undefined, page ? Number(page) : 1, limit ? Number(limit) : 50);
  }

  @Get('pos/template/download')
  downloadPoTemplate(@Res() res: Response) {
    const buffer = this.masters.generatePoTemplate();
    res.setHeader('Content-Disposition', 'attachment; filename="pos_template.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  }

  @Post('pos/import/preview')
  @UseInterceptors(FileInterceptor('file'))
  previewPoImport(@UploadedFile() file: Express.Multer.File) {
    return this.masters.previewPosExcel(file.buffer);
  }

  @Post('pos/import/confirm')
  @UseInterceptors(FileInterceptor('file'))
  confirmPoImport(@UploadedFile() file: Express.Multer.File) {
    return this.masters.importPosFromExcel(file.buffer);
  }

  @Get('pos/:id')
  findOnePo(@Param('id', ParseIntPipe) id: number) {
    return this.masters.findOnePo(id);
  }

  @Post('pos')
  createPo(@Body() dto: CreatePoDto) {
    return this.masters.createPo(dto);
  }

  @Put('pos/:id')
  updatePo(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePoDto) {
    return this.masters.updatePo(id, dto);
  }

  @Delete('pos/:id')
  removePo(@Param('id', ParseIntPipe) id: number) {
    return this.masters.removePo(id);
  }
}
