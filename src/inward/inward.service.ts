import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as XLSX from 'xlsx';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MastersService } from '../masters/masters.service';
import { CreateInwardDto, UpdateInwardDto } from './dto/inward.dto';

const INCLUDE_FULL = {
  createdBy: { select: { name: true } },
  party: { select: { id: true, name: true, code: true } },
  project: { select: { id: true, name: true, code: true } },
  product: { select: { id: true, productCode: true, productName: true, specification: true, businessLine: true } },
  poRef: { select: { id: true, poNumber: true } },
} as const;

@Injectable()
export class InwardService {
  constructor(
    private prisma: PrismaService,
    private masters: MastersService,
  ) {}

  async findAll(query: {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    partyId?: number;
    projectId?: number;
    productId?: number;
    poId?: number;
    year?: number;
  }) {
    const {
      search = '',
      page = 1,
      limit = 50,
      sortBy = 'date',
      sortDir = 'desc',
      partyId,
      projectId,
      productId,
      poId,
      year,
    } = query;
    const skip = (page - 1) * limit;
    const dir = sortDir === 'asc' ? ('asc' as const) : ('desc' as const);

    let orderBy: Prisma.InwardEntryOrderByWithRelationInput[];
    switch (sortBy) {
      case 'party':
        orderBy = [{ party: { name: dir } }, { id: dir }];
        break;
      case 'project':
        orderBy = [{ project: { name: dir } }, { id: dir }];
        break;
      case 'item':
        orderBy = [{ product: { productName: dir } }, { id: dir }];
        break;
      case 'quantity':
        orderBy = [{ inwardQty: dir }, { id: dir }];
        break;
      case 'date':
      default:
        orderBy = [{ date: dir }, { id: dir }];
        break;
    }

    const clauses: Prisma.InwardEntryWhereInput[] = [{ deletedAt: null }];

    if (partyId != null && Number.isFinite(partyId)) {
      clauses.push({ partyId });
    }
    if (projectId != null && Number.isFinite(projectId)) {
      clauses.push({ projectId });
    }
    if (productId != null && Number.isFinite(productId)) {
      clauses.push({ productId });
    }
    if (poId != null && Number.isFinite(poId)) {
      clauses.push({ poId });
    }
    if (year != null && Number.isFinite(year) && year >= 1900 && year <= 2100) {
      const yStart = new Date(year, 0, 1);
      const yEnd = new Date(year, 11, 31, 23, 59, 59, 999);
      clauses.push({ date: { gte: yStart, lte: yEnd } });
    }

    if (search) {
      clauses.push({
        OR: [
          { party: { name: { contains: search, mode: 'insensitive' as const } } },
          { product: { productCode: { contains: search, mode: 'insensitive' as const } } },
          { product: { productName: { contains: search, mode: 'insensitive' as const } } },
          { challan: { contains: search, mode: 'insensitive' as const } },
          { project: { name: { contains: search, mode: 'insensitive' as const } } },
        ],
      });
    }

    const where: Prisma.InwardEntryWhereInput = { AND: clauses };

    const [data, total] = await Promise.all([
      this.prisma.inwardEntry.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: INCLUDE_FULL,
      }),
      this.prisma.inwardEntry.count({ where }),
    ]);

    // Compute remainingPcs for each row: total inward - total dispatched for same partyId+productId
    const pairs = [...new Map(data.map((e) => [`${e.partyId}_${e.productId}`, { partyId: e.partyId, productId: e.productId }])).values()];

    const productIds = [...new Set(pairs.map((p) => p.productId))];
    const partyIds = [...new Set(pairs.map((p) => p.partyId))];

    const [inwardTotals, outwardRows] = await Promise.all([
      this.prisma.inwardEntry.groupBy({
        by: ['partyId', 'productId'],
        where: { deletedAt: null, partyId: { in: partyIds }, productId: { in: productIds } },
        _sum: { inwardQty: true },
      }),
      this.prisma.$queryRaw<{ partyId: number; productId: number; total: bigint }[]>`
        SELECT ps."partyId", psi."productId", COALESCE(SUM(psi.qty), 0) AS total
        FROM "PackingSlipItem" psi
        JOIN "PackingSlip" ps ON ps.id = psi."packingSlipId"
        WHERE psi."deletedAt" IS NULL AND ps."deletedAt" IS NULL
          AND ps."partyId" = ANY(${partyIds}::int[])
          AND psi."productId" = ANY(${productIds}::int[])
        GROUP BY ps."partyId", psi."productId"
      `,
    ]);

    const inwardMap = new Map(inwardTotals.map((r) => [`${r.partyId}_${r.productId}`, r._sum.inwardQty ?? 0]));
    const outwardMap = new Map(outwardRows.map((r) => [`${r.partyId}_${r.productId}`, Number(r.total)]));

    const enriched = data.map((e) => {
      const key = `${e.partyId}_${e.productId}`;
      const totalIn = inwardMap.get(key) ?? 0;
      const totalOut = outwardMap.get(key) ?? 0;
      return { ...e, remainingPcs: totalIn - totalOut };
    });

    return { data: enriched, total, page, limit };
  }

  async findOne(id: number) {
    const entry = await this.prisma.inwardEntry.findFirst({
      where: { id, deletedAt: null },
      include: INCLUDE_FULL,
    });
    if (!entry) throw new NotFoundException(`Inward entry ${id} not found`);
    return entry;
  }

  private startOfDay(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  private endOfDay(d: Date) {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
  }

  /** Today end; entries may be dated up to 2 calendar days in the past; no future dates. */
  private validateInwardDate(dateStr: string) {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) throw new BadRequestException('Invalid date');
    const todayEnd = this.endOfDay(new Date());
    if (d > todayEnd) throw new BadRequestException('Date cannot be in the future');
    const min = this.startOfDay(new Date());
    min.setDate(min.getDate() - 2);
    if (d < min) throw new BadRequestException('Inward date cannot be more than 2 days in the past');
  }

  private async checkDuplicate(challan: string, productId: number, excludeId?: number) {
    const existing = await this.prisma.inwardEntry.findFirst({
      where: { challan, productId, deletedAt: null, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    if (existing) throw new ConflictException(`Product already added for challan "${challan}"`);
  }

  async create(dto: CreateInwardDto, userId: number) {
    this.validateInwardDate(dto.date);
    await this.checkDuplicate(dto.challan, dto.productId);

    return this.prisma.inwardEntry.create({
      data: {
        date: new Date(dto.date),
        challan: dto.challan,
        partyId: dto.partyId,
        productId: dto.productId,
        inwardQty: dto.inwardQty,
        projectId: dto.projectId,
        poId: dto.poId,
        kg: dto.kg,
        specification: dto.specification,
        remarks: dto.remarks,
        year: dto.year,
        businessLine: dto.businessLine,
        createdById: userId,
      },
      include: INCLUDE_FULL,
    });
  }

  async update(_id: number, _dto: UpdateInwardDto) {
    throw new ForbiddenException('Records are immutable.');
  }

  async remove(id: number, role: string) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException('Only administrators can delete inward entries');
    }
    await this.findOne(id);
    return this.prisma.inwardEntry.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /** Distinct challans from inward entries, filtered by party/project/PO, oldest first */
  async getChallans(filters: { partyId?: number; projectId?: number; poId?: number }) {
    const where: Prisma.InwardEntryWhereInput = { deletedAt: null };
    if (filters.partyId) where.partyId = filters.partyId;
    if (filters.poId) where.poId = filters.poId;
    if (filters.projectId != null) {
      where.OR = [{ projectId: filters.projectId }, { projectId: null }];
    }

    const rows = await this.prisma.inwardEntry.findMany({
      where,
      select: {
        challan: true,
        date: true,
        party: { select: { name: true } },
        poRef: { select: { poNumber: true } },
      },
      distinct: ['challan'],
      orderBy: { date: 'asc' },
    });

    return rows.map((r) => ({
      challan: r.challan,
      date: r.date,
      partyName: r.party?.name ?? '',
      po: r.poRef?.poNumber,
    }));
  }

  async getPoItems(filters: { partyId?: number; projectId?: number; poId?: number }) {
    const where: Prisma.InwardEntryWhereInput = { deletedAt: null };
    if (filters.partyId) where.partyId = filters.partyId;
    if (filters.poId) where.poId = filters.poId;
    if (filters.projectId != null) {
      where.OR = [{ projectId: filters.projectId }, { projectId: null }];
    }

    const rows = await this.prisma.inwardEntry.findMany({
      where,
      select: {
        challan: true,
        date: true,
        inwardQty: true,
        product: {
          select: {
            id: true,
            productCode: true,
            productName: true,
            specification: true,
            businessLine: true,
            defaultBundleQty: true,
            defaultNoOfBundles: true,
          }
        }
      },
      orderBy: { date: 'asc' },
    });

    if (rows.length === 0) return [];

    // Compute already-dispatched qty per challan+product from packing slip items
    const challans = [...new Set(rows.map(r => r.challan))];
    const productIds = [...new Set(rows.map(r => r.product.id))];

    const outwardRows = await this.prisma.$queryRaw<{ dcLink: string; productId: number; total: bigint }[]>`
      SELECT psi."dcLink", psi."productId", COALESCE(SUM(psi.qty), 0) AS total
      FROM "PackingSlipItem" psi
      JOIN "PackingSlip" ps ON ps.id = psi."packingSlipId"
      WHERE psi."deletedAt" IS NULL AND ps."deletedAt" IS NULL
        AND psi."dcLink" = ANY(${challans}::text[])
        AND psi."productId" = ANY(${productIds}::int[])
      GROUP BY psi."dcLink", psi."productId"
    `;

    const outwardMap = new Map(outwardRows.map(r => [`${r.dcLink}_${r.productId}`, Number(r.total)]));

    return rows.map(r => {
      const dispatched = outwardMap.get(`${r.challan}_${r.product.id}`) ?? 0;
      return {
        challan: r.challan,
        date: r.date,
        productId: r.product.id,
        productCode: r.product.productCode,
        productName: r.product.productName,
        specification: r.product.specification,
        businessLine: r.product.businessLine,
        defaultBundleQty: r.product.defaultBundleQty,
        defaultNoOfBundles: r.product.defaultNoOfBundles,
        inwardQty: r.inwardQty,
        outwardQty: dispatched,
        remainingQty: r.inwardQty - dispatched,
      };
    });
  }

  async importFromExcel(buffer: Buffer, userId: number) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet);

    let imported = 0;
    let skipped = 0;

    for (const row of rows) {
      const partyName = String(row['Party Name'] || row['partyName'] || '').trim();
      const productCode = String(row['Product Code'] || row['productCode'] || '').trim();
      const productName = String(row['Product Name'] || row['productName'] || '').trim();
      const projectName = String(row['Project Name'] || row['projectName'] || '').trim();

      if (!partyName || !productCode) { skipped++; continue; }

      // Find or create party
      let party = await this.prisma.party.findFirst({
        where: { name: { equals: partyName, mode: 'insensitive' }, deletedAt: null },
      });
      if (!party) {
        party = await this.prisma.party.create({ data: { name: partyName } });
      }

      const dateRaw = row['DATE'] ?? row['date'];
      let dateIso: string;
      if (dateRaw != null && String(dateRaw).trim() !== '') {
        const parsed = new Date(String(dateRaw));
        if (Number.isNaN(parsed.getTime())) {
          skipped++;
          continue;
        }
        dateIso = parsed.toISOString().slice(0, 10);
      } else {
        dateIso = new Date().toISOString().slice(0, 10);
      }
      try {
        this.validateInwardDate(dateIso);
      } catch {
        skipped++;
        continue;
      }

      const challanStr = String(row['Challan'] || row['challan'] || '').trim();
      if (!challanStr) {
        skipped++;
        continue;
      }

      // Find or create product
      let product = await this.prisma.product.findUnique({ where: { productCode } });
      if (!product) {
        try {
          product = await this.masters.createProduct({
            productCode,
            productName: productName || productCode,
            specification: row['Specification'] ? String(row['Specification']) : undefined,
            businessLine: row['Business Line'] ? String(row['Business Line']) : undefined,
          });
        } catch {
          skipped++;
          continue;
        }
      }

      const dup = await this.prisma.inwardEntry.findFirst({
        where: { challan: challanStr, productId: product.id, deletedAt: null },
      });
      if (dup) {
        skipped++;
        continue;
      }

      // Find project (optional)
      let projectId: number | undefined;
      if (projectName) {
        let project = await this.prisma.project.findFirst({
          where: { name: { equals: projectName, mode: 'insensitive' }, deletedAt: null },
        });
        if (!project) {
          project = await this.prisma.project.create({
            data: { name: projectName, partyId: party.id },
          });
        }
        projectId = project.id;
      }

      // poId is nullable (Int?) in the schema; TS server may show stale cache errors here.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (this.prisma.inwardEntry.create as any)({
        data: {
          date: new Date(dateIso),
          challan: challanStr,
          partyId: party.id,
          productId: product.id,
          inwardQty: Number(row['Inward Qty'] || row['inwardQty'] || 0),
          projectId: projectId ?? null,
          poId: null,
          kg: row['KG'] ? Number(row['KG']) : null,
          challanDays: row['Challan Days'] ? Number(row['Challan Days']) : null,
          dcLink: row['DC Link'] ? String(row['DC Link']) : null,
          remarks: row['Remarks'] ? String(row['Remarks']) : null,
          year: row['Year'] ? String(row['Year']) : null,
          businessLine: row['Business Line'] ? String(row['Business Line']) : null,
          specification: row['Specification'] ? String(row['Specification']) : null,
          createdById: userId,
        },
      });
      imported++;
    }

    return { imported, skipped };
  }

  generateTemplate(): Buffer {
    const headers = [
      'DATE', 'Challan', 'Product Code', 'Product Name', 'Inward Qty',
      'Party Name', 'Project Name', 'KG', 'Challan Days',
      'DC Link', 'Remarks', 'Paint Applicable', 'Area in Sq Mtr',
      'Year', 'Business Line', 'Specification',
    ];
    const example = [
      '2024-01-01', 'CH001', 'PC001', 'Product X', 100,
      'Party A', 'Proj1', 50.5, 30,
      'DC001', 'Sample', false, 25.5,
      '2024', 'Line A', 'Spec1',
    ];
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inward');
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  }

  async previewExcel(buffer: Buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    return { preview: rows.slice(0, 10), total: rows.length };
  }
}
