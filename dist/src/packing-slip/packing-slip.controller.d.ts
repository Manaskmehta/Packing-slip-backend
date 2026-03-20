import { PackingSlipService } from './packing-slip.service';
import { CreatePackingSlipDto } from './dto/packing-slip.dto';
export declare class PackingSlipController {
    private packingSlip;
    constructor(packingSlip: PackingSlipService);
    findAll(query: {
        search?: string;
        page?: string;
        limit?: string;
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
                product: {
                    id: number;
                    productName: string;
                    productCode: string;
                };
                kg: number | null;
                dcLink: string | null;
                specification: string | null;
                businessLine: string | null;
                qty: number;
                bundleQty: number | null;
                noOfBundles: number | null;
                packagingWeightPerPc: number | null;
                packagingQty: number | null;
                slipWeight: number | null;
                finalBillableWeight: number | null;
            }[];
        } & {
            id: number;
            createdAt: Date;
            deletedAt: Date | null;
            date: Date;
            partyId: number;
            projectId: number | null;
            poId: number | null;
            remarks: string | null;
            createdById: number | null;
            updatedAt: Date;
            packagingWeightPerPc: number | null;
            packagingQty: number | null;
            slipWeight: number | null;
            finalBillableWeight: number | null;
            vehicleNo: string | null;
            slipNo: string;
            isLocked: boolean;
            printedAt: Date | null;
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
            email: string;
            name: string;
        } | null;
        items: ({
            product: {
                id: number;
                specification: string | null;
                businessLine: string | null;
                productName: string;
                productCode: string;
                hsnCode: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            deletedAt: Date | null;
            productId: number;
            kg: number | null;
            dcLink: string | null;
            specification: string | null;
            businessLine: string | null;
            qty: number;
            bundleQty: number | null;
            noOfBundles: number | null;
            packagingWeightPerPc: number | null;
            packagingQty: number | null;
            slipWeight: number | null;
            finalBillableWeight: number | null;
            packingSlipId: number;
        })[];
        productSummaries: ({
            product: {
                id: number;
                productName: string;
                productCode: string;
            };
        } & {
            id: number;
            createdAt: Date;
            productId: number;
            updatedAt: Date;
            packagingWeightPerPc: number | null;
            packagingQty: number | null;
            slipWeight: number | null;
            finalBillableWeight: number | null;
            packingSlipId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        date: Date;
        partyId: number;
        projectId: number | null;
        poId: number | null;
        remarks: string | null;
        createdById: number | null;
        updatedAt: Date;
        packagingWeightPerPc: number | null;
        packagingQty: number | null;
        slipWeight: number | null;
        finalBillableWeight: number | null;
        vehicleNo: string | null;
        slipNo: string;
        isLocked: boolean;
        printedAt: Date | null;
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
                productName: string;
                productCode: string;
                hsnCode: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            deletedAt: Date | null;
            productId: number;
            kg: number | null;
            dcLink: string | null;
            specification: string | null;
            businessLine: string | null;
            qty: number;
            bundleQty: number | null;
            noOfBundles: number | null;
            packagingWeightPerPc: number | null;
            packagingQty: number | null;
            slipWeight: number | null;
            finalBillableWeight: number | null;
            packingSlipId: number;
        })[];
        productSummaries: {
            id: number;
            createdAt: Date;
            productId: number;
            updatedAt: Date;
            packagingWeightPerPc: number | null;
            packagingQty: number | null;
            slipWeight: number | null;
            finalBillableWeight: number | null;
            packingSlipId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        date: Date;
        partyId: number;
        projectId: number | null;
        poId: number | null;
        remarks: string | null;
        createdById: number | null;
        updatedAt: Date;
        packagingWeightPerPc: number | null;
        packagingQty: number | null;
        slipWeight: number | null;
        finalBillableWeight: number | null;
        vehicleNo: string | null;
        slipNo: string;
        isLocked: boolean;
        printedAt: Date | null;
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
            email: string;
            name: string;
        } | null;
        items: ({
            product: {
                id: number;
                specification: string | null;
                businessLine: string | null;
                productName: string;
                productCode: string;
                hsnCode: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            deletedAt: Date | null;
            productId: number;
            kg: number | null;
            dcLink: string | null;
            specification: string | null;
            businessLine: string | null;
            qty: number;
            bundleQty: number | null;
            noOfBundles: number | null;
            packagingWeightPerPc: number | null;
            packagingQty: number | null;
            slipWeight: number | null;
            finalBillableWeight: number | null;
            packingSlipId: number;
        })[];
        productSummaries: ({
            product: {
                id: number;
                productName: string;
                productCode: string;
            };
        } & {
            id: number;
            createdAt: Date;
            productId: number;
            updatedAt: Date;
            packagingWeightPerPc: number | null;
            packagingQty: number | null;
            slipWeight: number | null;
            finalBillableWeight: number | null;
            packingSlipId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        date: Date;
        partyId: number;
        projectId: number | null;
        poId: number | null;
        remarks: string | null;
        createdById: number | null;
        updatedAt: Date;
        packagingWeightPerPc: number | null;
        packagingQty: number | null;
        slipWeight: number | null;
        finalBillableWeight: number | null;
        vehicleNo: string | null;
        slipNo: string;
        isLocked: boolean;
        printedAt: Date | null;
    }>;
    update(id: number, dto: CreatePackingSlipDto): Promise<{
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
                productName: string;
                productCode: string;
                hsnCode: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            deletedAt: Date | null;
            productId: number;
            kg: number | null;
            dcLink: string | null;
            specification: string | null;
            businessLine: string | null;
            qty: number;
            bundleQty: number | null;
            noOfBundles: number | null;
            packagingWeightPerPc: number | null;
            packagingQty: number | null;
            slipWeight: number | null;
            finalBillableWeight: number | null;
            packingSlipId: number;
        })[];
        productSummaries: {
            id: number;
            createdAt: Date;
            productId: number;
            updatedAt: Date;
            packagingWeightPerPc: number | null;
            packagingQty: number | null;
            slipWeight: number | null;
            finalBillableWeight: number | null;
            packingSlipId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        date: Date;
        partyId: number;
        projectId: number | null;
        poId: number | null;
        remarks: string | null;
        createdById: number | null;
        updatedAt: Date;
        packagingWeightPerPc: number | null;
        packagingQty: number | null;
        slipWeight: number | null;
        finalBillableWeight: number | null;
        vehicleNo: string | null;
        slipNo: string;
        isLocked: boolean;
        printedAt: Date | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        date: Date;
        partyId: number;
        projectId: number | null;
        poId: number | null;
        remarks: string | null;
        createdById: number | null;
        updatedAt: Date;
        packagingWeightPerPc: number | null;
        packagingQty: number | null;
        slipWeight: number | null;
        finalBillableWeight: number | null;
        vehicleNo: string | null;
        slipNo: string;
        isLocked: boolean;
        printedAt: Date | null;
    }>;
}
