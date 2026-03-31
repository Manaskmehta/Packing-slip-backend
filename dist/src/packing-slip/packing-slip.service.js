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
exports.PackingSlipService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
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
};
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
};
let PackingSlipService = class PackingSlipService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    startOfDay(d) {
        const x = new Date(d);
        x.setHours(0, 0, 0, 0);
        return x;
    }
    endOfDay(d) {
        const x = new Date(d);
        x.setHours(23, 59, 59, 999);
        return x;
    }
    validatePackingSlipDate(dateStr) {
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime()))
            throw new common_1.BadRequestException('Invalid slip date');
        const todayStart = this.startOfDay(new Date());
        const todayEnd = this.endOfDay(new Date());
        if (d < todayStart || d > todayEnd) {
            throw new common_1.BadRequestException('Packing slip date must be today — backdating and future dates are not allowed');
        }
    }
    async generateSlipNo() {
        const count = await this.prisma.packingSlip.count();
        const year = new Date().getFullYear();
        return `PS-${year}-${String(count + 1).padStart(5, '0')}`;
    }
    async findAll(query) {
        const { search = '', page = 1, limit = 50, sortBy = 'date', sortDir = 'desc', partyId, projectId, productId, isLocked, year, } = query;
        const skip = (page - 1) * limit;
        const dir = sortDir === 'asc' ? 'asc' : 'desc';
        const clauses = [{ deletedAt: null }];
        if (partyId != null && Number.isFinite(partyId)) {
            clauses.push({ partyId });
        }
        if (projectId != null && Number.isFinite(projectId)) {
            clauses.push({ projectId });
        }
        if (productId != null && Number.isFinite(productId)) {
            clauses.push({
                items: { some: { deletedAt: null, productId } },
            });
        }
        if (typeof isLocked === 'boolean') {
            clauses.push({ isLocked });
        }
        if (year != null && Number.isFinite(year) && year >= 1900 && year <= 2100) {
            const yStart = new Date(year, 0, 1);
            const yEnd = new Date(year, 11, 31, 23, 59, 59, 999);
            clauses.push({ date: { gte: yStart, lte: yEnd } });
        }
        if (search) {
            clauses.push({
                OR: [
                    { slipNo: { contains: search, mode: 'insensitive' } },
                    { party: { name: { contains: search, mode: 'insensitive' } } },
                    { project: { name: { contains: search, mode: 'insensitive' } } },
                    {
                        items: {
                            some: {
                                deletedAt: null,
                                OR: [
                                    { product: { productCode: { contains: search, mode: 'insensitive' } } },
                                    { product: { productName: { contains: search, mode: 'insensitive' } } },
                                ],
                            },
                        },
                    },
                ],
            });
        }
        const where = { AND: clauses };
        const listInclude = {
            createdBy: { select: { name: true } },
            party: { select: { id: true, name: true, code: true } },
            project: { select: { id: true, name: true, code: true } },
            poRef: { select: { id: true, poNumber: true } },
            items: {
                where: { deletedAt: null },
                select: ITEM_SELECT_FIELDS,
            },
        };
        const total = await this.prisma.packingSlip.count({ where });
        const SORT_MEM_LIMIT = 8000;
        const useMemSort = (sortBy === 'quantity' || sortBy === 'item') && total > 0 && total <= SORT_MEM_LIMIT;
        if (useMemSort) {
            const lite = (await this.prisma.packingSlip.findMany({
                where,
                select: {
                    id: true,
                    items: {
                        where: { deletedAt: null },
                        select: {
                            qty: true,
                            product: { select: { productName: true, productCode: true } },
                        },
                    },
                },
            }));
            const sorted = [...lite].sort((a, b) => {
                if (sortBy === 'quantity') {
                    const qa = a.items.reduce((s, i) => s + i.qty, 0);
                    const qb = b.items.reduce((s, i) => s + i.qty, 0);
                    return dir === 'asc' ? qa - qb : qb - qa;
                }
                const minLabel = (items) => items.length === 0
                    ? ''
                    : items
                        .map((i) => i.product.productName || i.product.productCode)
                        .sort((x, y) => x.localeCompare(y, undefined, { sensitivity: 'base' }))[0];
                const c = minLabel(a.items).localeCompare(minLabel(b.items), undefined, { sensitivity: 'base' });
                return dir === 'asc' ? c : -c;
            });
            const pageIds = sorted.slice(skip, skip + limit).map((x) => x.id);
            if (pageIds.length === 0) {
                return { data: [], total, page, limit };
            }
            const rows = await this.prisma.packingSlip.findMany({
                where: { id: { in: pageIds } },
                include: listInclude,
            });
            const orderMap = new Map(pageIds.map((id, i) => [id, i]));
            rows.sort((a, b) => (orderMap.get(a.id) - orderMap.get(b.id)));
            return { data: rows, total, page, limit };
        }
        let orderBy;
        switch (sortBy) {
            case 'party':
                orderBy = [{ party: { name: dir } }, { id: dir }];
                break;
            case 'project':
                orderBy = [{ project: { name: dir } }, { id: dir }];
                break;
            case 'quantity':
            case 'item':
                orderBy = [{ date: 'desc' }, { id: 'desc' }];
                break;
            case 'date':
            default:
                orderBy = [{ date: dir }, { id: dir }];
                break;
        }
        const data = await this.prisma.packingSlip.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: listInclude,
        });
        return { data, total, page, limit };
    }
    async findOne(id) {
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
        if (!slip)
            throw new common_1.NotFoundException(`Packing slip ${id} not found`);
        return slip;
    }
    async getRemainingForChallan(challan, productId, excludeSlipId) {
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
    async validateStock(items, excludeSlipId) {
        for (const item of items) {
            if (!item.dcLink)
                continue;
            const remaining = await this.getRemainingForChallan(item.dcLink, item.productId, excludeSlipId);
            if (item.qty > remaining) {
                throw new common_1.BadRequestException(`Qty ${item.qty} exceeds remaining stock ${remaining} for product on challan "${item.dcLink}"`);
            }
        }
    }
    async create(dto, userId) {
        this.validatePackingSlipDate(dto.date);
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
    async lock(id) {
        const slip = await this.findOne(id);
        if (slip.isLocked)
            return slip;
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
    async update(_id, _dto) {
        throw new common_1.ForbiddenException('Records are immutable.');
    }
    async remove(id) {
        const slip = await this.findOne(id);
        if (slip.isLocked)
            throw new common_1.ForbiddenException('Packing slip is locked and cannot be deleted');
        const now = new Date();
        await this.prisma.packingSlipItem.updateMany({
            where: { packingSlipId: id, deletedAt: null },
            data: { deletedAt: now },
        });
        return this.prisma.packingSlip.update({
            where: { id },
            data: { deletedAt: now },
        });
    }
};
exports.PackingSlipService = PackingSlipService;
exports.PackingSlipService = PackingSlipService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PackingSlipService);
//# sourceMappingURL=packing-slip.service.js.map