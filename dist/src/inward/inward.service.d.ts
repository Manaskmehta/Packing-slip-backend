import { PrismaService } from '../prisma/prisma.service';
import { MastersService } from '../masters/masters.service';
import { CreateInwardDto, UpdateInwardDto } from './dto/inward.dto';
export declare class InwardService {
    private prisma;
    private masters;
    constructor(prisma: PrismaService, masters: MastersService);
    findAll(query: {
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
    }): Promise<{
        data: {
            remainingPcs: number;
            party: {
                id: number;
                code: string | null;
                name: string;
            };
            product: {
                id: number;
                specification: string | null;
                businessLine: string | null;
                productCode: string;
                productName: string;
            };
            project: {
                id: number;
                code: string | null;
                name: string;
            } | null;
            poRef: {
                id: number;
                poNumber: string;
            } | null;
            createdBy: {
                name: string;
            } | null;
            id: number;
            srNo: number;
            date: Date;
            challan: string;
            partyId: number;
            productId: number;
            projectId: number | null;
            poId: number | null;
            createdById: number | null;
            inwardQty: number;
            kg: number | null;
            specification: string | null;
            businessLine: string | null;
            challanDays: number | null;
            dcLink: string | null;
            remarks: string | null;
            year: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<{
        party: {
            id: number;
            code: string | null;
            name: string;
        };
        product: {
            id: number;
            specification: string | null;
            businessLine: string | null;
            productCode: string;
            productName: string;
        };
        project: {
            id: number;
            code: string | null;
            name: string;
        } | null;
        poRef: {
            id: number;
            poNumber: string;
        } | null;
        createdBy: {
            name: string;
        } | null;
    } & {
        id: number;
        srNo: number;
        date: Date;
        challan: string;
        partyId: number;
        productId: number;
        projectId: number | null;
        poId: number | null;
        createdById: number | null;
        inwardQty: number;
        kg: number | null;
        specification: string | null;
        businessLine: string | null;
        challanDays: number | null;
        dcLink: string | null;
        remarks: string | null;
        year: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    private startOfDay;
    private endOfDay;
    private validateInwardDate;
    private checkDuplicate;
    create(dto: CreateInwardDto, userId: number): Promise<{
        party: {
            id: number;
            code: string | null;
            name: string;
        };
        product: {
            id: number;
            specification: string | null;
            businessLine: string | null;
            productCode: string;
            productName: string;
        };
        project: {
            id: number;
            code: string | null;
            name: string;
        } | null;
        poRef: {
            id: number;
            poNumber: string;
        } | null;
        createdBy: {
            name: string;
        } | null;
    } & {
        id: number;
        srNo: number;
        date: Date;
        challan: string;
        partyId: number;
        productId: number;
        projectId: number | null;
        poId: number | null;
        createdById: number | null;
        inwardQty: number;
        kg: number | null;
        specification: string | null;
        businessLine: string | null;
        challanDays: number | null;
        dcLink: string | null;
        remarks: string | null;
        year: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    update(_id: number, _dto: UpdateInwardDto): Promise<void>;
    remove(id: number, role: string): Promise<{
        id: number;
        srNo: number;
        date: Date;
        challan: string;
        partyId: number;
        productId: number;
        projectId: number | null;
        poId: number | null;
        createdById: number | null;
        inwardQty: number;
        kg: number | null;
        specification: string | null;
        businessLine: string | null;
        challanDays: number | null;
        dcLink: string | null;
        remarks: string | null;
        year: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
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
        defaultBundleQty: number | null;
        defaultNoOfBundles: number | null;
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
