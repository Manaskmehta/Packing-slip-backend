import type { Response } from 'express';
import { InwardService } from './inward.service';
import { CreateInwardDto, UpdateInwardDto } from './dto/inward.dto';
export declare class InwardController {
    private inward;
    constructor(inward: InwardService);
    findAll(query: {
        search?: string;
        page?: string;
        limit?: string;
        sortBy?: string;
        sortDir?: string;
        partyId?: string;
        projectId?: string;
        productId?: string;
        poId?: string;
        year?: string;
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
    getChallans(partyId?: string, projectId?: string, poId?: string): Promise<{
        challan: string;
        date: Date;
        partyName: string;
        po: string | undefined;
    }[]>;
    getPoItems(partyId?: string, projectId?: string, poId?: string): Promise<{
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
    create(dto: CreateInwardDto, req: any): Promise<{
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
    update(id: number, dto: UpdateInwardDto): Promise<void>;
    remove(id: number, req: {
        user: {
            role: string;
        };
    }): Promise<{
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
    previewImport(file: Express.Multer.File): Promise<{
        preview: unknown[];
        total: number;
    }>;
    confirmImport(file: Express.Multer.File, req: any): Promise<{
        imported: number;
        skipped: number;
    }>;
    downloadTemplate(res: Response): void;
}
