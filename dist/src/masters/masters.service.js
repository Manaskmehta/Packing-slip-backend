"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MastersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const XLSX = __importStar(require("xlsx"));
const prisma_service_1 = require("../prisma/prisma.service");
let MastersService = class MastersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllParties(search, activeOnly = false, page = 1, limit = 50) {
        const where = {
            deletedAt: null,
            ...(activeOnly ? { isActive: true } : {}),
            ...(search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { code: { contains: search, mode: 'insensitive' } },
                        { gstNo: { contains: search, mode: 'insensitive' } },
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
    async findOneParty(id) {
        const p = await this.prisma.party.findFirst({ where: { id, deletedAt: null } });
        if (!p)
            throw new common_1.NotFoundException(`Party ${id} not found`);
        return p;
    }
    async createParty(dto) {
        if (dto.code) {
            const exists = await this.prisma.party.findUnique({ where: { code: dto.code } });
            if (exists)
                throw new common_1.ConflictException(`Party code '${dto.code}' already exists`);
        }
        return this.prisma.party.create({ data: dto });
    }
    async updateParty(id, dto) {
        await this.findOneParty(id);
        return this.prisma.party.update({ where: { id }, data: dto });
    }
    async removeParty(id) {
        await this.findOneParty(id);
        const [inwardCount, slipCount, projectCount, poCount] = await Promise.all([
            this.prisma.inwardEntry.count({ where: { partyId: id, deletedAt: null } }),
            this.prisma.packingSlip.count({ where: { partyId: id, deletedAt: null } }),
            this.prisma.project.count({ where: { partyId: id, deletedAt: null } }),
            this.prisma.pO.count({ where: { partyId: id, deletedAt: null } }),
        ]);
        const total = inwardCount + slipCount + projectCount + poCount;
        if (total > 0) {
            const parts = [];
            if (inwardCount)
                parts.push(`${inwardCount} inward ${inwardCount === 1 ? 'entry' : 'entries'}`);
            if (slipCount)
                parts.push(`${slipCount} packing ${slipCount === 1 ? 'slip' : 'slips'}`);
            if (projectCount)
                parts.push(`${projectCount} ${projectCount === 1 ? 'project' : 'projects'}`);
            if (poCount)
                parts.push(`${poCount} ${poCount === 1 ? 'PO' : 'POs'}`);
            throw new common_1.ConflictException(`Cannot delete — this party is referenced by ${parts.join(', ')}. Mark it as Inactive instead.`);
        }
        return this.prisma.party.update({ where: { id }, data: { deletedAt: new Date() } });
    }
    async findAllProjects(search, activeOnly = false, partyId, page = 1, limit = 50) {
        const where = {
            deletedAt: null,
            ...(activeOnly ? { isActive: true } : {}),
            ...(partyId ? { partyId } : {}),
            ...(search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { code: { contains: search, mode: 'insensitive' } },
                        { party: { name: { contains: search, mode: 'insensitive' } } },
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
    async findOneProject(id) {
        const p = await this.prisma.project.findFirst({
            where: { id, deletedAt: null },
            include: { party: { select: { id: true, name: true, code: true } } },
        });
        if (!p)
            throw new common_1.NotFoundException(`Project ${id} not found`);
        return p;
    }
    async createProject(dto) {
        if (dto.code) {
            const exists = await this.prisma.project.findUnique({ where: { code: dto.code } });
            if (exists)
                throw new common_1.ConflictException(`Project code '${dto.code}' already exists`);
        }
        return this.prisma.project.create({ data: dto });
    }
    async updateProject(id, dto) {
        await this.findOneProject(id);
        return this.prisma.project.update({ where: { id }, data: dto });
    }
    async removeProject(id) {
        await this.findOneProject(id);
        const [inwardCount, slipCount, poCount] = await Promise.all([
            this.prisma.inwardEntry.count({ where: { projectId: id, deletedAt: null } }),
            this.prisma.packingSlip.count({ where: { projectId: id, deletedAt: null } }),
            this.prisma.pO.count({ where: { projectId: id, deletedAt: null } }),
        ]);
        const total = inwardCount + slipCount + poCount;
        if (total > 0) {
            const parts = [];
            if (inwardCount)
                parts.push(`${inwardCount} inward ${inwardCount === 1 ? 'entry' : 'entries'}`);
            if (slipCount)
                parts.push(`${slipCount} packing ${slipCount === 1 ? 'slip' : 'slips'}`);
            if (poCount)
                parts.push(`${poCount} ${poCount === 1 ? 'PO' : 'POs'}`);
            throw new common_1.ConflictException(`Cannot delete — this project is referenced by ${parts.join(', ')}. Mark it as Inactive instead.`);
        }
        return this.prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
    }
    async assertSpecificationUnique(spec, excludeProductId) {
        const trimmed = (spec ?? '').trim();
        if (!trimmed)
            return;
        const rows = await this.prisma.$queryRaw `
      SELECT id FROM "Product"
      WHERE "deletedAt" IS NULL
        AND "specification" IS NOT NULL
        AND TRIM("specification") <> ''
        AND LOWER(TRIM("specification")) = LOWER(${trimmed})
        ${excludeProductId != null ? client_1.Prisma.sql `AND id <> ${excludeProductId}` : client_1.Prisma.empty}
      LIMIT 1
    `;
        if (rows.length > 0) {
            throw new common_1.ConflictException('This specification is already assigned to another item in the master');
        }
    }
    async findAllProducts(search, activeOnly = false, page = 1, limit = 50, allowedIds) {
        const where = {
            deletedAt: null,
            ...(activeOnly && !allowedIds?.length ? { isActive: true } : {}),
            ...(allowedIds?.length ? { id: { in: allowedIds } } : {}),
            ...(search
                ? {
                    OR: [
                        { productCode: { contains: search, mode: 'insensitive' } },
                        { productName: { contains: search, mode: 'insensitive' } },
                        { businessLine: { contains: search, mode: 'insensitive' } },
                        { specification: { contains: search, mode: 'insensitive' } },
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
    async findOneProduct(id) {
        const p = await this.prisma.product.findFirst({ where: { id, deletedAt: null } });
        if (!p)
            throw new common_1.NotFoundException(`Product ${id} not found`);
        return p;
    }
    async createProduct(dto) {
        const exists = await this.prisma.product.findUnique({ where: { productCode: dto.productCode } });
        if (exists)
            throw new common_1.ConflictException(`Product code '${dto.productCode}' already exists`);
        await this.assertSpecificationUnique(dto.specification);
        return this.prisma.product.create({ data: dto });
    }
    async updateProduct(id, dto) {
        await this.findOneProduct(id);
        await this.assertSpecificationUnique(dto.specification, id);
        return this.prisma.product.update({ where: { id }, data: dto });
    }
    async removeProduct(id) {
        await this.findOneProduct(id);
        const [inwardCount, slipItemCount] = await Promise.all([
            this.prisma.inwardEntry.count({ where: { productId: id, deletedAt: null } }),
            this.prisma.packingSlipItem.count({ where: { productId: id, deletedAt: null } }),
        ]);
        const total = inwardCount + slipItemCount;
        if (total > 0) {
            const parts = [];
            if (inwardCount)
                parts.push(`${inwardCount} inward ${inwardCount === 1 ? 'entry' : 'entries'}`);
            if (slipItemCount)
                parts.push(`${slipItemCount} packing slip ${slipItemCount === 1 ? 'item' : 'items'}`);
            throw new common_1.ConflictException(`Cannot delete — this product is referenced by ${parts.join(', ')}. Mark it as Inactive instead.`);
        }
        return this.prisma.product.update({ where: { id }, data: { deletedAt: new Date() } });
    }
    generateProductTemplate() {
        const headers = [
            'Product Code',
            'Product Name',
            'Specification',
            'Business Line',
            'HSN Code',
            'UOM',
            'Qty per Bundle',
            'No. of Bundles (default)',
            'Description',
        ];
        const example = ['PROD-001', 'Aluminium Pipe 2 inch', '2 inch dia', 'Aluminium', '7608', 'PCS', 10, 5, 'Optional description'];
        const ws = XLSX.utils.aoa_to_sheet([headers, example]);
        ws['!cols'] = headers.map((_, i) => ({ wch: i === 1 ? 30 : 18 }));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Products');
        return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    }
    async previewProductsExcel(buffer) {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        return { preview: rows.slice(0, 10), total: rows.length };
    }
    async importProductsFromExcel(buffer) {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        let imported = 0;
        let updated = 0;
        let skipped = 0;
        for (const row of rows) {
            const productCode = String(row['Product Code'] || row['productCode'] || '').trim();
            const productName = String(row['Product Name'] || row['productName'] || '').trim();
            if (!productCode || !productName) {
                skipped++;
                continue;
            }
            const existing = await this.prisma.product.findUnique({ where: { productCode } });
            const specVal = row['Specification'] ? String(row['Specification']) : undefined;
            const parseOptInt = (v) => {
                if (v === undefined || v === null || v === '')
                    return undefined;
                const n = Number(v);
                return Number.isFinite(n) && n >= 0 ? Math.trunc(n) : undefined;
            };
            const bundleQty = parseOptInt(row['Qty per Bundle'] ?? row['qtyPerBundle'] ?? row['defaultBundleQty']);
            const bundleN = parseOptInt(row['No. of Bundles (default)'] ?? row['defaultNoOfBundles'] ?? row['No. of Bundles']);
            if (existing) {
                await this.assertSpecificationUnique(specVal ?? existing.specification, existing.id);
                await this.prisma.product.update({
                    where: { productCode },
                    data: {
                        productName,
                        ...(row['Specification'] ? { specification: String(row['Specification']) } : {}),
                        ...(row['Business Line'] ? { businessLine: String(row['Business Line']) } : {}),
                        ...(row['HSN Code'] ? { hsnCode: String(row['HSN Code']) } : {}),
                        ...(row['UOM'] ? { uom: String(row['UOM']) } : {}),
                        ...(row['Description'] ? { description: String(row['Description']) } : {}),
                        ...(bundleQty !== undefined ? { defaultBundleQty: bundleQty } : {}),
                        ...(bundleN !== undefined ? { defaultNoOfBundles: bundleN } : {}),
                    },
                });
                updated++;
            }
            else {
                await this.assertSpecificationUnique(specVal);
                await this.prisma.product.create({
                    data: {
                        productCode,
                        productName,
                        specification: specVal,
                        businessLine: row['Business Line'] ? String(row['Business Line']) : undefined,
                        hsnCode: row['HSN Code'] ? String(row['HSN Code']) : undefined,
                        uom: row['UOM'] ? String(row['UOM']) : 'PCS',
                        description: row['Description'] ? String(row['Description']) : undefined,
                        defaultBundleQty: bundleQty,
                        defaultNoOfBundles: bundleN,
                    },
                });
                imported++;
            }
        }
        return { imported, updated, skipped };
    }
    generatePartyTemplate() {
        const headers = ['Party Code', 'Party Name', 'Address', 'Phone', 'GST No'];
        const example = ['TATA', 'Tata Steel Ltd', '123 Industrial Area, Mumbai', '9876543210', '27AAACT2727Q1ZW'];
        const ws = XLSX.utils.aoa_to_sheet([headers, example]);
        ws['!cols'] = headers.map((_, i) => ({ wch: i === 1 ? 30 : 20 }));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Parties');
        return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    }
    async previewPartiesExcel(buffer) {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        return { preview: rows.slice(0, 10), total: rows.length };
    }
    async importPartiesFromExcel(buffer) {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        let imported = 0;
        let updated = 0;
        let skipped = 0;
        for (const row of rows) {
            const name = String(row['Party Name'] || row['name'] || '').trim();
            if (!name) {
                skipped++;
                continue;
            }
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
            }
            else {
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
    generateProjectTemplate() {
        const headers = ['Project Code', 'Project Name', 'Party Code', 'Description'];
        const example = ['PROJ-001', 'Refinery Expansion Phase 2', 'TATA', 'Optional description'];
        const ws = XLSX.utils.aoa_to_sheet([headers, example]);
        ws['!cols'] = headers.map((_, i) => ({ wch: i === 1 ? 35 : 20 }));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Projects');
        return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    }
    async previewProjectsExcel(buffer) {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        return { preview: rows.slice(0, 10), total: rows.length };
    }
    async importProjectsFromExcel(buffer) {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        let imported = 0;
        let updated = 0;
        let skipped = 0;
        for (const row of rows) {
            const name = String(row['Project Name'] || row['name'] || '').trim();
            if (!name) {
                skipped++;
                continue;
            }
            const code = row['Project Code'] ? String(row['Project Code']).trim() : undefined;
            const partyCode = row['Party Code'] ? String(row['Party Code']).trim() : undefined;
            let partyId;
            if (partyCode) {
                const party = await this.prisma.party.findUnique({ where: { code: partyCode } });
                if (party)
                    partyId = party.id;
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
            }
            else {
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
    generatePoTemplate() {
        const headers = ['PO Number', 'Party Code', 'Project Code', 'Date', 'Image Link'];
        const example = ['PO/2024-25/001', 'TATA', 'PROJ-001', '2024-04-15', 'https://drive.google.com/...'];
        const ws = XLSX.utils.aoa_to_sheet([headers, example]);
        ws['!cols'] = headers.map((_, i) => ({ wch: i === 0 ? 22 : i === 4 ? 35 : 18 }));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'POs');
        return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    }
    async previewPosExcel(buffer) {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        return { preview: rows.slice(0, 10), total: rows.length };
    }
    async importPosFromExcel(buffer) {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        let imported = 0;
        let updated = 0;
        let skipped = 0;
        for (const row of rows) {
            const poNumber = String(row['PO Number'] || row['poNumber'] || '').trim();
            if (!poNumber) {
                skipped++;
                continue;
            }
            const partyCode = row['Party Code'] ? String(row['Party Code']).trim() : undefined;
            const projectCode = row['Project Code'] ? String(row['Project Code']).trim() : undefined;
            let partyId;
            let projectId;
            if (partyCode) {
                const party = await this.prisma.party.findUnique({ where: { code: partyCode } });
                if (party)
                    partyId = party.id;
            }
            if (projectCode) {
                const project = await this.prisma.project.findUnique({ where: { code: projectCode } });
                if (project)
                    projectId = project.id;
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
            }
            else {
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
    async findAllPos(search, partyId, page = 1, limit = 50) {
        const where = {
            deletedAt: null,
            ...(partyId ? { partyId } : {}),
            ...(search
                ? {
                    OR: [
                        { poNumber: { contains: search, mode: 'insensitive' } },
                        { party: { name: { contains: search, mode: 'insensitive' } } },
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
    async findOnePo(id) {
        const p = await this.prisma.pO.findFirst({
            where: { id, deletedAt: null },
            include: {
                party: { select: { id: true, name: true } },
                project: { select: { id: true, name: true } },
            },
        });
        if (!p)
            throw new common_1.NotFoundException(`PO ${id} not found`);
        return p;
    }
    async createPo(dto) {
        const exists = await this.prisma.pO.findUnique({ where: { poNumber: dto.poNumber } });
        if (exists)
            throw new common_1.ConflictException(`PO number '${dto.poNumber}' already exists`);
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
    async updatePo(id, dto) {
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
    async removePo(id) {
        await this.findOnePo(id);
        const [inwardCount, slipCount] = await Promise.all([
            this.prisma.inwardEntry.count({ where: { poId: id, deletedAt: null } }),
            this.prisma.packingSlip.count({ where: { poId: id, deletedAt: null } }),
        ]);
        const total = inwardCount + slipCount;
        if (total > 0) {
            const parts = [];
            if (inwardCount)
                parts.push(`${inwardCount} inward ${inwardCount === 1 ? 'entry' : 'entries'}`);
            if (slipCount)
                parts.push(`${slipCount} packing ${slipCount === 1 ? 'slip' : 'slips'}`);
            throw new common_1.ConflictException(`Cannot delete — this PO is referenced by ${parts.join(', ')}. Mark it as Inactive instead.`);
        }
        return this.prisma.pO.update({ where: { id }, data: { deletedAt: new Date() } });
    }
};
exports.MastersService = MastersService;
exports.MastersService = MastersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MastersService);
//# sourceMappingURL=masters.service.js.map