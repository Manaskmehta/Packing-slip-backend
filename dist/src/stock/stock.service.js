"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StockService = class StockService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCurrentStock(search) {
        const inwardRaw = await this.prisma.inwardEntry.groupBy({
            by: ['productId'],
            where: { deletedAt: null },
            _sum: { inwardQty: true },
        });
        const outwardRaw = await this.prisma.packingSlipItem.groupBy({
            by: ['productId'],
            where: { deletedAt: null },
            _sum: { qty: true },
        });
        const outwardMap = new Map(outwardRaw.map((o) => [o.productId, o._sum.qty || 0]));
        const productIds = inwardRaw.map((r) => r.productId).filter((id) => id !== null);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, productCode: true, productName: true },
        });
        const productMap = new Map(products.map((p) => [p.id, p]));
        let stock = inwardRaw.map((i) => {
            const prod = i.productId !== null ? productMap.get(i.productId) : undefined;
            const outQty = i.productId !== null ? (outwardMap.get(i.productId) ?? 0) : 0;
            const inQty = i._sum?.inwardQty || 0;
            return {
                productCode: prod?.productCode || '',
                productName: prod?.productName || '',
                totalInward: inQty,
                totalOutward: outQty,
                available: inQty - outQty,
            };
        });
        if (search) {
            const q = search.toLowerCase();
            stock = stock.filter((s) => s.productCode.toLowerCase().includes(q) ||
                s.productName.toLowerCase().includes(q));
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
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StockService);
//# sourceMappingURL=stock.service.js.map