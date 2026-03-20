import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackingSlipDto } from './dto/packing-slip.dto';

const ITEM_INCLUDE = {
  product: {
    select: {
      id: true,
      productCode: true,
      productName: true,
      hsnCode: true,
      specification: true,
      businessLine: true,
    },
  },
} as const;

// Fields selected on each item in list/findOne responses
const ITEM_SELECT_FIELDS = {
  id: true,
  qty: true,
  kg: true,
  dcLink: true,
  specification: true,
  businessLine: true,
  bundleQty: true,
  noOfBundles: true,
  packagingWeightPerPc: true,
  packagingQty: true,
  slipWeight: true,
  finalBillableWeight: true,
  product: { select: { id: true, productCode: true, productName: true } },
} as const;

@Injectable()
export class PackingSlipService {
  constructor(private prisma: PrismaService) {}

  private async generateSlipNo(): Promise<string> {
    // Count ALL slips including deleted to avoid slip number reuse
    const count = await this.prisma.packingSlip.count();
    const year = new Date().getFullYear();
    return `PS-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  async findAll(query: { search?: string; page?: number; limit?: number }) {
    const { search = '', page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          deletedAt: null,
          OR: [
            { slipNo: { contains: search, mode: 'insensitive' as const } },
            { party: { name: { contains: search, mode: 'insensitive' as const } } },
            { project: { name: { contains: search, mode: 'insensitive' as const } } },
            {
              items: {
                some: {
                  deletedAt: null,
                  OR: [
                    { product: { productCode: { contains: search, mode: 'insensitive' as const } } },
                    { product: { productName: { contains: search, mode: 'insensitive' as const } } },
                  ],
                },
              },
            },
          ],
        }
      : { deletedAt: null };

    const [data, total] = await Promise.all([
      this.prisma.packingSlip.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: { select: { name: true } },
          party: { select: { id: true, name: true, code: true } },
          project: { select: { id: true, name: true, code: true } },
          poRef: { select: { id: true, poNumber: true } },
          items: {
            where: { deletedAt: null },
            select: ITEM_SELECT_FIELDS,
          },
        },
      }),
      this.prisma.packingSlip.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const slip = await this.prisma.packingSlip.findFirst({
      where: { id, deletedAt: null },
      include: {
        createdBy: { select: { name: true, email: true } },
        party: { select: { id: true, name: true, gstNo: true, address: true } },
        project: { select: { id: true, name: true, code: true } },
        poRef: { select: { id: true, poNumber: true } },
        items: { where: { deletedAt: null }, include: ITEM_INCLUDE },
        productSummaries: { include: { product: { select: { id: true, productCode: true, productName: true } } } },
      },
    });
    if (!slip) throw new NotFoundException(`Packing slip ${id} not found`);
    return slip;
  }

  /** Returns remaining qty for a specific challan+product, optionally excluding one slip's items */
  private async getRemainingForChallan(
    challan: string,
    productId: number,
    excludeSlipId?: number,
  ): Promise<number> {
    const inward = await this.prisma.inwardEntry.aggregate({
      where: { challan, productId, deletedAt: null },
      _sum: { inwardQty: true },
    });
    const totalInward = inward._sum.inwardQty ?? 0;

    const outwardItems = await this.prisma.packingSlipItem.findMany({
      where: {
        dcLink: challan,
        productId,
        deletedAt: null,
        packingSlip: {
          deletedAt: null,
          ...(excludeSlipId ? { id: { not: excludeSlipId } } : {}),
        },
      },
      select: { qty: true },
    });
    const totalOutward = outwardItems.reduce((s, i) => s + i.qty, 0);
    return totalInward - totalOutward;
  }

  /** Throws if any item with a dcLink exceeds remaining stock */
  private async validateStock(
    items: CreatePackingSlipDto['items'],
    excludeSlipId?: number,
  ): Promise<void> {
    for (const item of items) {
      if (!item.dcLink) continue;
      const remaining = await this.getRemainingForChallan(item.dcLink, item.productId, excludeSlipId);
      if (item.qty > remaining) {
        throw new BadRequestException(
          `Qty ${item.qty} exceeds remaining stock ${remaining} for product on challan "${item.dcLink}"`,
        );
      }
    }
  }

  async create(dto: CreatePackingSlipDto, userId: number) {
    await this.validateStock(dto.items);
    const slipNo = await this.generateSlipNo();
    return this.prisma.packingSlip.create({
      data: {
        slipNo,
        date: new Date(dto.date),
        partyId: dto.partyId,
        projectId: dto.projectId,
        poId: dto.poId,
        remarks: dto.remarks,
        vehicleNo: dto.vehicleNo ?? null,
        slipWeight: dto.slipWeight,
        finalBillableWeight: dto.finalBillableWeight,
        packagingWeightPerPc: dto.packagingWeightPerPc ?? null,
        packagingQty: dto.packagingQty ?? null,
        createdById: userId,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            dcLink: item.dcLink,
            specification: item.specification,
            businessLine: item.businessLine,
            qty: item.qty,
            kg: item.kg,
            bundleQty: item.bundleQty,
            noOfBundles: item.noOfBundles,
            packagingWeightPerPc: item.packagingWeightPerPc ?? null,
            packagingQty: item.packagingQty ?? null,
            slipWeight: item.slipWeight ?? null,
            finalBillableWeight: item.finalBillableWeight ?? null,
          })),
        },
        productSummaries: {
          create: dto.productSummaries?.map((s) => ({
            productId: s.productId,
            slipWeight: s.slipWeight,
            packagingWeightPerPc: s.packagingWeightPerPc,
            packagingQty: s.packagingQty,
            finalBillableWeight: s.finalBillableWeight,
          })) ?? [],
        },
      },
      include: {
        party: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
        items: { where: { deletedAt: null }, include: ITEM_INCLUDE },
        productSummaries: true,
      },
    });
  }

  async lock(id: number) {
    const slip = await this.findOne(id);
    if (slip.isLocked) return slip;
    return this.prisma.packingSlip.update({
      where: { id },
      data: { isLocked: true, printedAt: new Date() },
      include: {
        createdBy: { select: { name: true, email: true } },
        party: { select: { id: true, name: true, gstNo: true, address: true } },
        project: { select: { id: true, name: true, code: true } },
        poRef: { select: { id: true, poNumber: true } },
        items: { where: { deletedAt: null }, include: ITEM_INCLUDE },
        productSummaries: { include: { product: { select: { id: true, productCode: true, productName: true } } } },
      },
    });
  }

  async update(id: number, dto: CreatePackingSlipDto) {
    const slip = await this.findOne(id);
    if (slip.isLocked) throw new ForbiddenException('Packing slip is locked and cannot be edited');

    // Validate stock excluding this slip's own items (they'll be replaced)
    await this.validateStock(dto.items, id);

    // Soft-delete all existing items before recreating them
    await this.prisma.packingSlipItem.updateMany({
      where: { packingSlipId: id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    // Hard-delete existing product summaries
    await this.prisma.packingSlipProductSummary.deleteMany({
      where: { packingSlipId: id },
    });

    return this.prisma.packingSlip.update({
      where: { id },
      data: {
        date: new Date(dto.date),
        partyId: dto.partyId,
        projectId: dto.projectId,
        poId: dto.poId,
        remarks: dto.remarks,
        vehicleNo: dto.vehicleNo ?? null,
        slipWeight: dto.slipWeight,
        finalBillableWeight: dto.finalBillableWeight,
        packagingWeightPerPc: dto.packagingWeightPerPc ?? null,
        packagingQty: dto.packagingQty ?? null,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            dcLink: item.dcLink,
            specification: item.specification,
            businessLine: item.businessLine,
            qty: item.qty,
            kg: item.kg,
            bundleQty: item.bundleQty,
            noOfBundles: item.noOfBundles,
            packagingWeightPerPc: item.packagingWeightPerPc ?? null,
            packagingQty: item.packagingQty ?? null,
            slipWeight: item.slipWeight ?? null,
            finalBillableWeight: item.finalBillableWeight ?? null,
          })),
        },
        productSummaries: {
          create: dto.productSummaries?.map((s) => ({
            productId: s.productId,
            slipWeight: s.slipWeight,
            packagingWeightPerPc: s.packagingWeightPerPc,
            packagingQty: s.packagingQty,
            finalBillableWeight: s.finalBillableWeight,
          })) ?? [],
        },
      },
      include: {
        party: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
        items: { where: { deletedAt: null }, include: ITEM_INCLUDE },
        productSummaries: true,
      },
    });
  }

  async remove(id: number) {
    const slip = await this.findOne(id);
    if (slip.isLocked) throw new ForbiddenException('Packing slip is locked and cannot be deleted');

    const now = new Date();
    // Soft-delete all items first, then soft-delete the slip
    await this.prisma.packingSlipItem.updateMany({
      where: { packingSlipId: id, deletedAt: null },
      data: { deletedAt: now },
    });

    return this.prisma.packingSlip.update({
      where: { id },
      data: { deletedAt: now },
    });
  }
}
