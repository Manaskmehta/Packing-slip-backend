import { PackingSlipService } from './packing-slip.service';
import { CreatePackingSlipDto } from './dto/packing-slip.dto';
export declare class PackingSlipController {
    private packingSlip;
    constructor(packingSlip: PackingSlipService);
    findAll(query: {
        search?: string;
        page?: string;
        limit?: string;
        sortBy?: string;
        sortDir?: string;
        partyId?: string;
        projectId?: string;
        productId?: string;
        year?: string;
        isLocked?: string;
    }): Promise<{
        data: ({
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
            poRef: {
                id: number;
                poNumber: string;
            } | null;
            createdBy: {
                name: string;
            } | null;
            items: {
                id: number;
                slipWeight: number | null;
                finalBillableWeight: number | null;
                packagingWeightPerPc: number | null;
                packagingQty: number | null;
                dcLink: string | null;
                specification: string | null;
                businessLine: string | null;
                qty: number;
                kg: number | null;
                bundleQty: number | null;
                noOfBundles: number | null;
                product: {
                    id: number;
                    productCode: string;
                    productName: string;
                };
            }[];
        } & {
            id: number;
            slipNo: string;
            date: Date;
            partyId: number;
            projectId: number | null;
            poId: number | null;
            createdById: number | null;
            remarks: string | null;
            vehicleNo: string | null;
            slipWeight: number | null;
            finalBillableWeight: number | null;
            packagingWeightPerPc: number | null;
            packagingQty: number | null;
            isLocked: boolean;
            printedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<{
        party: {
            id: number;
            name: string;
            address: string | null;
            gstNo: string | null;
        };
        project: {
            id: number;
            name: string;
            code: string | null;
        } | null;
        poRef: {
            id: number;
            poNumber: string;
        } | null;
        createdBy: {
            name: string;
            email: string;
        } | null;
        items: ({
            product: {
                id: number;
                specification: string | null;
                businessLine: string | null;
                productCode: string;
                productName: string;
                hsnCode: string | null;
            };
        } & {
            id: number;
            slipWeight: number | null;
            finalBillableWeight: number | null;
            packagingWeightPerPc: number | null;
            packagingQty: number | null;
            createdAt: Date;
            deletedAt: Date | null;
            packingSlipId: number;
            productId: number;
            dcLink: string | null;
            specification: string | null;
            businessLine: string | null;
            qty: number;
            kg: number | null;
            bundleQty: number | null;
            noOfBundles: number | null;
        })[];
        productSummaries: ({
            product: {
                id: number;
                productCode: string;
                productName: string;
            };
        } & {
            id: number;
            slipWeight: number | null;
            finalBillableWeight: number | null;
            packagingWeightPerPc: number | null;
            packagingQty: number | null;
            createdAt: Date;
            updatedAt: Date;
            packingSlipId: number;
            productId: number;
        })[];
    } & {
        id: number;
        slipNo: string;
        date: Date;
        partyId: number;
        projectId: number | null;
        poId: number | null;
        createdById: number | null;
        remarks: string | null;
        vehicleNo: string | null;
        slipWeight: number | null;
        finalBillableWeight: number | null;
        packagingWeightPerPc: number | null;
        packagingQty: number | null;
        isLocked: boolean;
        printedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    create(dto: CreatePackingSlipDto, req: any): Promise<{
        party: {
            id: number;
            name: string;
        };
        project: {
            id: number;
            name: string;
        } | null;
        items: ({
            product: {
                id: number;
                specification: string | null;
                businessLine: string | null;
                productCode: string;
                productName: string;
                hsnCode: string | null;
            };
        } & {
            id: number;
            slipWeight: number | null;
            finalBillableWeight: number | null;
            packagingWeightPerPc: number | null;
            packagingQty: number | null;
            createdAt: Date;
            deletedAt: Date | null;
            packingSlipId: number;
            productId: number;
            dcLink: string | null;
            specification: string | null;
            businessLine: string | null;
            qty: number;
            kg: number | null;
            bundleQty: number | null;
            noOfBundles: number | null;
        })[];
        productSummaries: {
            id: number;
            slipWeight: number | null;
            finalBillableWeight: number | null;
            packagingWeightPerPc: number | null;
            packagingQty: number | null;
            createdAt: Date;
            updatedAt: Date;
            packingSlipId: number;
            productId: number;
        }[];
    } & {
        id: number;
        slipNo: string;
        date: Date;
        partyId: number;
        projectId: number | null;
        poId: number | null;
        createdById: number | null;
        remarks: string | null;
        vehicleNo: string | null;
        slipWeight: number | null;
        finalBillableWeight: number | null;
        packagingWeightPerPc: number | null;
        packagingQty: number | null;
        isLocked: boolean;
        printedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    lock(id: number): Promise<{
        party: {
            id: number;
            name: string;
            address: string | null;
            gstNo: string | null;
        };
        project: {
            id: number;
            name: string;
            code: string | null;
        } | null;
        poRef: {
            id: number;
            poNumber: string;
        } | null;
        createdBy: {
            name: string;
            email: string;
        } | null;
        items: ({
            product: {
                id: number;
                specification: string | null;
                businessLine: string | null;
                productCode: string;
                productName: string;
                hsnCode: string | null;
            };
        } & {
            id: number;
            slipWeight: number | null;
            finalBillableWeight: number | null;
            packagingWeightPerPc: number | null;
            packagingQty: number | null;
            createdAt: Date;
            deletedAt: Date | null;
            packingSlipId: number;
            productId: number;
            dcLink: string | null;
            specification: string | null;
            businessLine: string | null;
            qty: number;
            kg: number | null;
            bundleQty: number | null;
            noOfBundles: number | null;
        })[];
        productSummaries: ({
            product: {
                id: number;
                productCode: string;
                productName: string;
            };
        } & {
            id: number;
            slipWeight: number | null;
            finalBillableWeight: number | null;
            packagingWeightPerPc: number | null;
            packagingQty: number | null;
            createdAt: Date;
            updatedAt: Date;
            packingSlipId: number;
            productId: number;
        })[];
    } & {
        id: number;
        slipNo: string;
        date: Date;
        partyId: number;
        projectId: number | null;
        poId: number | null;
        createdById: number | null;
        remarks: string | null;
        vehicleNo: string | null;
        slipWeight: number | null;
        finalBillableWeight: number | null;
        packagingWeightPerPc: number | null;
        packagingQty: number | null;
        isLocked: boolean;
        printedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    update(id: number, dto: CreatePackingSlipDto): Promise<void>;
    remove(id: number): Promise<{
        id: number;
        slipNo: string;
        date: Date;
        partyId: number;
        projectId: number | null;
        poId: number | null;
        createdById: number | null;
        remarks: string | null;
        vehicleNo: string | null;
        slipWeight: number | null;
        finalBillableWeight: number | null;
        packagingWeightPerPc: number | null;
        packagingQty: number | null;
        isLocked: boolean;
        printedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
