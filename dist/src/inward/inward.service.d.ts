import { PrismaService } from '../prisma/prisma.service';
import { CreateInwardDto, UpdateInwardDto } from './dto/inward.dto';
export declare class InwardService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: {
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: {
            remainingPcs: number;
            party: {
                id: number;
                name: string;
                code: string | null;
            };
            project: {
                id: number;
                name: string;
                code: string | null;
            } | null;
            product: {
                id: number;
                specification: string | null;
                businessLine: string | null;
                productName: string;
                productCode: string;
            };
            poRef: {
                id: number;
                poNumber: string;
            } | null;
            createdBy: {
                name: string;
            } | null;
            id: number;
            createdAt: Date;
            deletedAt: Date | null;
            year: string | null;
            date: Date;
            challan: string;
            partyId: number;
            productId: number;
            inwardQty: number;
            projectId: number | null;
            poId: number | null;
            kg: number | null;
            challanDays: number | null;
            dcLink: string | null;
            specification: string | null;
            remarks: string | null;
            businessLine: string | null;
            srNo: number;
            createdById: number | null;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<{
        party: {
            id: number;
            name: string;
            code: string | null;
        };
        project: {
            id: number;
            name: string;
            code: string | null;
        } | null;
        product: {
            id: number;
            specification: string | null;
            businessLine: string | null;
            productName: string;
            productCode: string;
        };
        poRef: {
            id: number;
            poNumber: string;
        } | null;
        createdBy: {
            name: string;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        year: string | null;
        date: Date;
        challan: string;
        partyId: number;
        productId: number;
        inwardQty: number;
        projectId: number | null;
        poId: number | null;
        kg: number | null;
        challanDays: number | null;
        dcLink: string | null;
        specification: string | null;
        remarks: string | null;
        businessLine: string | null;
        srNo: number;
        createdById: number | null;
        updatedAt: Date;
    }>;
    private validateDate;
    private checkDuplicate;
    create(dto: CreateInwardDto, userId: number): Promise<{
        party: {
            id: number;
            name: string;
            code: string | null;
        };
        project: {
            id: number;
            name: string;
            code: string | null;
        } | null;
        product: {
            id: number;
            specification: string | null;
            businessLine: string | null;
            productName: string;
            productCode: string;
        };
        poRef: {
            id: number;
            poNumber: string;
        } | null;
        createdBy: {
            name: string;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        year: string | null;
        date: Date;
        challan: string;
        partyId: number;
        productId: number;
        inwardQty: number;
        projectId: number | null;
        poId: number | null;
        kg: number | null;
        challanDays: number | null;
        dcLink: string | null;
        specification: string | null;
        remarks: string | null;
        businessLine: string | null;
        srNo: number;
        createdById: number | null;
        updatedAt: Date;
    }>;
    update(id: number, dto: UpdateInwardDto): Promise<{
        party: {
            id: number;
            name: string;
            code: string | null;
        };
        project: {
            id: number;
            name: string;
            code: string | null;
        } | null;
        product: {
            id: number;
            specification: string | null;
            businessLine: string | null;
            productName: string;
            productCode: string;
        };
        poRef: {
            id: number;
            poNumber: string;
        } | null;
        createdBy: {
            name: string;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        year: string | null;
        date: Date;
        challan: string;
        partyId: number;
        productId: number;
        inwardQty: number;
        projectId: number | null;
        poId: number | null;
        kg: number | null;
        challanDays: number | null;
        dcLink: string | null;
        specification: string | null;
        remarks: string | null;
        businessLine: string | null;
        srNo: number;
        createdById: number | null;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        year: string | null;
        date: Date;
        challan: string;
        partyId: number;
        productId: number;
        inwardQty: number;
        projectId: number | null;
        poId: number | null;
        kg: number | null;
        challanDays: number | null;
        dcLink: string | null;
        specification: string | null;
        remarks: string | null;
        businessLine: string | null;
        srNo: number;
        createdById: number | null;
        updatedAt: Date;
    }>;
    getChallans(filters: {
        partyId?: number;
        projectId?: number;
        poId?: number;
    }): Promise<{
        challan: string;
        date: Date;
        partyName: string;
        po: string | undefined;
    }[]>;
    getPoItems(filters: {
        partyId?: number;
        projectId?: number;
        poId?: number;
    }): Promise<{
        challan: string;
        date: Date;
        productId: number;
        productCode: string;
        productName: string;
        specification: string | null;
        businessLine: string | null;
        inwardQty: number;
        outwardQty: number;
        remainingQty: number;
    }[]>;
    importFromExcel(buffer: Buffer, userId: number): Promise<{
        imported: number;
        skipped: number;
    }>;
    generateTemplate(): Buffer;
    previewExcel(buffer: Buffer): Promise<{
        preview: unknown[];
        total: number;
    }>;
}
