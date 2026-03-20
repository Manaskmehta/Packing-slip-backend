import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartyDto, UpdatePartyDto } from './dto/party.dto';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CreatePoDto, UpdatePoDto } from './dto/po.dto';

@Injectable()
export class MastersService {
  constructor(private prisma: PrismaService) {}

  // ─── Party ───────────────────────────────────────────────────────────────────

  async findAllParties(search?: string, activeOnly = false, page = 1, limit = 50) {
    const where = {
      deletedAt: null,
      ...(activeOnly ? { isActive: true } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { code: { contains: search, mode: 'insensitive' as const } },
              { gstNo: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.party.findMany({ where, orderBy: { name: 'asc' }, skip, take: limit }),
      this.prisma.party.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOneParty(id: number) {
    const p = await this.prisma.party.findFirst({ where: { id, deletedAt: null } });
    if (!p) throw new NotFoundException(`Party ${id} not found`);
    return p;
  }

  async createParty(dto: CreatePartyDto) {
    if (dto.code) {
      const exists = await this.prisma.party.findUnique({ where: { code: dto.code } });
      if (exists) throw new ConflictException(`Party code '${dto.code}' already exists`);
    }
    return this.prisma.party.create({ data: dto });
  }

  async updateParty(id: number, dto: UpdatePartyDto) {
    await this.findOneParty(id);
    return this.prisma.party.update({ where: { id }, data: dto });
  }

  async removeParty(id: number) {
    await this.findOneParty(id);

    const [inwardCount, slipCount, projectCount, poCount] = await Promise.all([
      this.prisma.inwardEntry.count({ where: { partyId: id, deletedAt: null } }),
      this.prisma.packingSlip.count({ where: { partyId: id, deletedAt: null } }),
      this.prisma.project.count({ where: { partyId: id, deletedAt: null } }),
      this.prisma.pO.count({ where: { partyId: id, deletedAt: null } }),
    ]);

    const total = inwardCount + slipCount + projectCount + poCount;
    if (total > 0) {
      const parts: string[] = [];
      if (inwardCount) parts.push(`${inwardCount} inward ${inwardCount === 1 ? 'entry' : 'entries'}`);
      if (slipCount) parts.push(`${slipCount} packing ${slipCount === 1 ? 'slip' : 'slips'}`);
      if (projectCount) parts.push(`${projectCount} ${projectCount === 1 ? 'project' : 'projects'}`);
      if (poCount) parts.push(`${poCount} ${poCount === 1 ? 'PO' : 'POs'}`);
      throw new ConflictException(
        `Cannot delete — this party is referenced by ${parts.join(', ')}. Mark it as Inactive instead.`,
      );
    }

    return this.prisma.party.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Project ─────────────────────────────────────────────────────────────────

  async findAllProjects(search?: string, activeOnly = false, partyId?: number, page = 1, limit = 50) {
    const where = {
      deletedAt: null,
      ...(activeOnly ? { isActive: true } : {}),
      ...(partyId ? { partyId } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { code: { contains: search, mode: 'insensitive' as const } },
              { party: { name: { contains: search, mode: 'insensitive' as const } } },
            ],
          }
        : {}),
    };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
        include: { party: { select: { id: true, name: true, code: true } } },
      }),
      this.prisma.project.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOneProject(id: number) {
    const p = await this.prisma.project.findFirst({
      where: { id, deletedAt: null },
      include: { party: { select: { id: true, name: true, code: true } } },
    });
    if (!p) throw new NotFoundException(`Project ${id} not found`);
    return p;
  }

  async createProject(dto: CreateProjectDto) {
    if (dto.code) {
      const exists = await this.prisma.project.findUnique({ where: { code: dto.code } });
      if (exists) throw new ConflictException(`Project code '${dto.code}' already exists`);
    }
    return this.prisma.project.create({ data: dto });
  }

  async updateProject(id: number, dto: UpdateProjectDto) {
    await this.findOneProject(id);
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  async removeProject(id: number) {
    await this.findOneProject(id);

    const [inwardCount, slipCount, poCount] = await Promise.all([
      this.prisma.inwardEntry.count({ where: { projectId: id, deletedAt: null } }),
      this.prisma.packingSlip.count({ where: { projectId: id, deletedAt: null } }),
      this.prisma.pO.count({ where: { projectId: id, deletedAt: null } }),
    ]);

    const total = inwardCount + slipCount + poCount;
    if (total > 0) {
      const parts: string[] = [];
      if (inwardCount) parts.push(`${inwardCount} inward ${inwardCount === 1 ? 'entry' : 'entries'}`);
      if (slipCount) parts.push(`${slipCount} packing ${slipCount === 1 ? 'slip' : 'slips'}`);
      if (poCount) parts.push(`${poCount} ${poCount === 1 ? 'PO' : 'POs'}`);
      throw new ConflictException(
        `Cannot delete — this project is referenced by ${parts.join(', ')}. Mark it as Inactive instead.`,
      );
    }

    return this.prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Product ─────────────────────────────────────────────────────────────────

  async findAllProducts(search?: string, activeOnly = false, page = 1, limit = 50) {
    const where = {
      deletedAt: null,
      ...(activeOnly ? { isActive: true } : {}),
      ...(search
        ? {
            OR: [
              { productCode: { contains: search, mode: 'insensitive' as const } },
              { productName: { contains: search, mode: 'insensitive' as const } },
              { businessLine: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({ where, orderBy: { productCode: 'asc' }, skip, take: limit }),
      this.prisma.product.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOneProduct(id: number) {
    const p = await this.prisma.product.findFirst({ where: { id, deletedAt: null } });
    if (!p) throw new NotFoundException(`Product ${id} not found`);
    return p;
  }

  async createProduct(dto: CreateProductDto) {
    const exists = await this.prisma.product.findUnique({ where: { productCode: dto.productCode } });
    if (exists) throw new ConflictException(`Product code '${dto.productCode}' already exists`);
    return this.prisma.product.create({ data: dto });
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    await this.findOneProduct(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async removeProduct(id: number) {
    await this.findOneProduct(id);

    const [inwardCount, slipItemCount] = await Promise.all([
      this.prisma.inwardEntry.count({ where: { productId: id, deletedAt: null } }),
      this.prisma.packingSlipItem.count({ where: { productId: id, deletedAt: null } }),
    ]);

    const total = inwardCount + slipItemCount;
    if (total > 0) {
      const parts: string[] = [];
      if (inwardCount) parts.push(`${inwardCount} inward ${inwardCount === 1 ? 'entry' : 'entries'}`);
      if (slipItemCount) parts.push(`${slipItemCount} packing slip ${slipItemCount === 1 ? 'item' : 'items'}`);
      throw new ConflictException(
        `Cannot delete — this product is referenced by ${parts.join(', ')}. Mark it as Inactive instead.`,
      );
    }

    return this.prisma.product.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  generateProductTemplate(): Buffer {
    const headers = ['Product Code', 'Product Name', 'Specification', 'Business Line', 'HSN Code', 'UOM', 'Description'];
    const example = ['PROD-001', 'Aluminium Pipe 2 inch', '2 inch dia', 'Aluminium', '7608', 'PCS', 'Optional description'];
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    ws['!cols'] = headers.map((_, i) => ({ wch: i === 1 ? 30 : 18 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  }

  async previewProductsExcel(buffer: Buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    return { preview: rows.slice(0, 10), total: rows.length };
  }

  async importProductsFromExcel(buffer: Buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet);

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const row of rows) {
      const productCode = String(row['Product Code'] || row['productCode'] || '').trim();
      const productName = String(row['Product Name'] || row['productName'] || '').trim();

      if (!productCode || !productName) { skipped++; continue; }

      const existing = await this.prisma.product.findUnique({ where: { productCode } });

      if (existing) {
        await this.prisma.product.update({
          where: { productCode },
          data: {
            productName,
            ...(row['Specification'] ? { specification: String(row['Specification']) } : {}),
            ...(row['Business Line'] ? { businessLine: String(row['Business Line']) } : {}),
            ...(row['HSN Code'] ? { hsnCode: String(row['HSN Code']) } : {}),
            ...(row['UOM'] ? { uom: String(row['UOM']) } : {}),
            ...(row['Description'] ? { description: String(row['Description']) } : {}),
          },
        });
        updated++;
      } else {
        await this.prisma.product.create({
          data: {
            productCode,
            productName,
            specification: row['Specification'] ? String(row['Specification']) : undefined,
            businessLine: row['Business Line'] ? String(row['Business Line']) : undefined,
            hsnCode: row['HSN Code'] ? String(row['HSN Code']) : undefined,
            uom: row['UOM'] ? String(row['UOM']) : 'PCS',
            description: row['Description'] ? String(row['Description']) : undefined,
          },
        });
        imported++;
      }
    }

    return { imported, updated, skipped };
  }

  // ─── Party Import ────────────────────────────────────────────────────────────

  generatePartyTemplate(): Buffer {
    const headers = ['Party Code', 'Party Name', 'Address', 'Phone', 'GST No'];
    const example = ['TATA', 'Tata Steel Ltd', '123 Industrial Area, Mumbai', '9876543210', '27AAACT2727Q1ZW'];
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    ws['!cols'] = headers.map((_, i) => ({ wch: i === 1 ? 30 : 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Parties');
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  }

  async previewPartiesExcel(buffer: Buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    return { preview: rows.slice(0, 10), total: rows.length };
  }

  async importPartiesFromExcel(buffer: Buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet);

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const row of rows) {
      const name = String(row['Party Name'] || row['name'] || '').trim();
      if (!name) { skipped++; continue; }

      const code = row['Party Code'] ? String(row['Party Code']).trim() : undefined;
      const existing = code ? await this.prisma.party.findUnique({ where: { code } }) : null;

      if (existing) {
        await this.prisma.party.update({
          where: { code },
          data: {
            name,
            ...(row['Address'] ? { address: String(row['Address']) } : {}),
            ...(row['Phone'] ? { phone: String(row['Phone']) } : {}),
            ...(row['GST No'] ? { gstNo: String(row['GST No']) } : {}),
          },
        });
        updated++;
      } else {
        await this.prisma.party.create({
          data: {
            name,
            ...(code ? { code } : {}),
            address: row['Address'] ? String(row['Address']) : undefined,
            phone: row['Phone'] ? String(row['Phone']) : undefined,
            gstNo: row['GST No'] ? String(row['GST No']) : undefined,
          },
        });
        imported++;
      }
    }

    return { imported, updated, skipped };
  }

  // ─── Project Import ───────────────────────────────────────────────────────────

  generateProjectTemplate(): Buffer {
    const headers = ['Project Code', 'Project Name', 'Party Code', 'Description'];
    const example = ['PROJ-001', 'Refinery Expansion Phase 2', 'TATA', 'Optional description'];
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    ws['!cols'] = headers.map((_, i) => ({ wch: i === 1 ? 35 : 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Projects');
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  }

  async previewProjectsExcel(buffer: Buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    return { preview: rows.slice(0, 10), total: rows.length };
  }

  async importProjectsFromExcel(buffer: Buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet);

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const row of rows) {
      const name = String(row['Project Name'] || row['name'] || '').trim();
      if (!name) { skipped++; continue; }

      const code = row['Project Code'] ? String(row['Project Code']).trim() : undefined;
      const partyCode = row['Party Code'] ? String(row['Party Code']).trim() : undefined;

      let partyId: number | undefined;
      if (partyCode) {
        const party = await this.prisma.party.findUnique({ where: { code: partyCode } });
        if (party) partyId = party.id;
      }

      const existing = code ? await this.prisma.project.findUnique({ where: { code } }) : null;

      if (existing) {
        await this.prisma.project.update({
          where: { code },
          data: {
            name,
            ...(partyId !== undefined ? { partyId } : {}),
            ...(row['Description'] ? { description: String(row['Description']) } : {}),
          },
        });
        updated++;
      } else {
        await this.prisma.project.create({
          data: {
            name,
            ...(code ? { code } : {}),
            ...(partyId !== undefined ? { partyId } : {}),
            description: row['Description'] ? String(row['Description']) : undefined,
          },
        });
        imported++;
      }
    }

    return { imported, updated, skipped };
  }

  // ─── PO Import ────────────────────────────────────────────────────────────────

  generatePoTemplate(): Buffer {
    const headers = ['PO Number', 'Party Code', 'Project Code', 'Date', 'Image Link'];
    const example = ['PO/2024-25/001', 'TATA', 'PROJ-001', '2024-04-15', 'https://drive.google.com/...'];
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    ws['!cols'] = headers.map((_, i) => ({ wch: i === 0 ? 22 : i === 4 ? 35 : 18 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'POs');
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  }

  async previewPosExcel(buffer: Buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    return { preview: rows.slice(0, 10), total: rows.length };
  }

  async importPosFromExcel(buffer: Buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet);

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const row of rows) {
      const poNumber = String(row['PO Number'] || row['poNumber'] || '').trim();
      if (!poNumber) { skipped++; continue; }

      const partyCode = row['Party Code'] ? String(row['Party Code']).trim() : undefined;
      const projectCode = row['Project Code'] ? String(row['Project Code']).trim() : undefined;

      let partyId: number | undefined;
      let projectId: number | undefined;

      if (partyCode) {
        const party = await this.prisma.party.findUnique({ where: { code: partyCode } });
        if (party) partyId = party.id;
      }
      if (projectCode) {
        const project = await this.prisma.project.findUnique({ where: { code: projectCode } });
        if (project) projectId = project.id;
      }

      const dateRaw = row['Date'] ? String(row['Date']).trim() : undefined;
      const date = dateRaw ? new Date(dateRaw) : undefined;

      const existing = await this.prisma.pO.findUnique({ where: { poNumber } });

      if (existing) {
        await this.prisma.pO.update({
          where: { poNumber },
          data: {
            ...(partyId !== undefined ? { partyId } : {}),
            ...(projectId !== undefined ? { projectId } : {}),
            ...(date ? { date } : {}),
            ...(row['Image Link'] ? { imageLink: String(row['Image Link']) } : {}),
          },
        });
        updated++;
      } else {
        await this.prisma.pO.create({
          data: {
            poNumber,
            ...(partyId !== undefined ? { partyId } : {}),
            ...(projectId !== undefined ? { projectId } : {}),
            ...(date ? { date } : {}),
            imageLink: row['Image Link'] ? String(row['Image Link']) : undefined,
          },
        });
        imported++;
      }
    }

    return { imported, updated, skipped };
  }

  // ─── PO ──────────────────────────────────────────────────────────────────────

  async findAllPos(search?: string, partyId?: number, page = 1, limit = 50) {
    const where = {
      deletedAt: null,
      ...(partyId ? { partyId } : {}),
      ...(search
        ? {
            OR: [
              { poNumber: { contains: search, mode: 'insensitive' as const } },
              { party: { name: { contains: search, mode: 'insensitive' as const } } },
            ],
          }
        : {}),
    };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.pO.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          party: { select: { id: true, name: true, code: true } },
          project: { select: { id: true, name: true, code: true } },
        },
      }),
      this.prisma.pO.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOnePo(id: number) {
    const p = await this.prisma.pO.findFirst({
      where: { id, deletedAt: null },
      include: {
        party: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
    });
    if (!p) throw new NotFoundException(`PO ${id} not found`);
    return p;
  }

  async createPo(dto: CreatePoDto) {
    const exists = await this.prisma.pO.findUnique({ where: { poNumber: dto.poNumber } });
    if (exists) throw new ConflictException(`PO number '${dto.poNumber}' already exists`);
    return this.prisma.pO.create({
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
      },
      include: {
        party: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
    });
  }

  async updatePo(id: number, dto: UpdatePoDto) {
    await this.findOnePo(id);
    return this.prisma.pO.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
      },
      include: {
        party: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
    });
  }

  async removePo(id: number) {
    await this.findOnePo(id);

    const [inwardCount, slipCount] = await Promise.all([
      this.prisma.inwardEntry.count({ where: { poId: id, deletedAt: null } }),
      this.prisma.packingSlip.count({ where: { poId: id, deletedAt: null } }),
    ]);

    const total = inwardCount + slipCount;
    if (total > 0) {
      const parts: string[] = [];
      if (inwardCount) parts.push(`${inwardCount} inward ${inwardCount === 1 ? 'entry' : 'entries'}`);
      if (slipCount) parts.push(`${slipCount} packing ${slipCount === 1 ? 'slip' : 'slips'}`);
      throw new ConflictException(
        `Cannot delete — this PO is referenced by ${parts.join(', ')}. Mark it as Inactive instead.`,
      );
    }

    return this.prisma.pO.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
