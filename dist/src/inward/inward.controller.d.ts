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
        inwardQty: number;
        outwardQty: number;
        remainingQty: number;
    }[]>;
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
    create(dto: CreateInwardDto, req: any): Promise<{
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
