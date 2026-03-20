import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async getCurrentStock(search?: string) {
    // Inward: grouped by productId — exclude soft-deleted entries
    const inwardRaw = await this.prisma.inwardEntry.groupBy({
      by: ['productId'],
      where: { deletedAt: null },
      _sum: { inwardQty: true, kg: true },
    });

    // Outward: grouped by productId from PackingSlipItem — exclude soft-deleted items
    const outwardRaw = await this.prisma.packingSlipItem.groupBy({
      by: ['productId'],
      where: { deletedAt: null },
      _sum: { qty: true, kg: true },
    });

    const outwardMap = new Map(
      outwardRaw.map((o) => [
        o.productId,
        { qty: o._sum.qty || 0, kg: o._sum.kg || 0 },
      ]),
    );

    // Fetch product master data for all inward product IDs
    const productIds = inwardRaw.map((r) => r.productId).filter((id): id is number => id !== null);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, productCode: true, productName: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let stock = inwardRaw.map((i) => {
      const prod = i.productId !== null ? productMap.get(i.productId) : undefined;
      const out = i.productId !== null ? (outwardMap.get(i.productId) || { qty: 0, kg: 0 }) : { qty: 0, kg: 0 };
      return {
        productCode: prod?.productCode || '',
        productName: prod?.productName || '',
        totalInward: i._sum?.inwardQty || 0,
        totalOutward: out.qty,
        available: (i._sum?.inwardQty || 0) - out.qty,
        totalKgInward: i._sum?.kg || 0,
        totalKgOutward: out.kg,
        availableKg: (i._sum?.kg || 0) - out.kg,
      };
    });

    if (search) {
      const q = search.toLowerCase();
      stock = stock.filter(
        (s) =>
          s.productCode.toLowerCase().includes(q) ||
          s.productName.toLowerCase().includes(q),
      );
    }

    const totalInwardPcs = stock.reduce((acc, s) => acc + s.totalInward, 0);
    const totalOutwardPcs = stock.reduce((acc, s) => acc + s.totalOutward, 0);
    const totalAvailable = stock.reduce((acc, s) => acc + s.available, 0);

    return { stock, summary: { totalInwardPcs, totalOutwardPcs, totalAvailable } };
  }

  async getDashboardStats() {
    const [totalInward, totalSlips, lockedSlips, outwardAgg] = await Promise.all([
      this.prisma.inwardEntry.aggregate({
        where: { deletedAt: null },
        _sum: { inwardQty: true },
      }),
      this.prisma.packingSlip.count({ where: { deletedAt: null } }),
      this.prisma.packingSlip.count({ where: { isLocked: true, deletedAt: null } }),
      this.prisma.packingSlipItem.aggregate({
        where: { deletedAt: null },
        _sum: { qty: true },
      }),
    ]);

    return {
      totalInwardPcs: totalInward._sum.inwardQty || 0,
      totalOutwardPcs: outwardAgg._sum.qty || 0,
      availableStock: (totalInward._sum.inwardQty || 0) - (outwardAgg._sum.qty || 0),
      totalPackingSlips: totalSlips,
      printedSlips: lockedSlips,
    };
  }
}
