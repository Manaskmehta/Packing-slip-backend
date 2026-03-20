export declare class PackingSlipItemDto {
    productId: number;
    dcLink?: string;
    specification?: string;
    businessLine?: string;
    qty: number;
    kg?: number;
    bundleQty?: number;
    noOfBundles?: number;
    packagingWeightPerPc?: number;
    packagingQty?: number;
    slipWeight?: number;
    finalBillableWeight?: number;
}
export declare class PackingSlipProductSummaryDto {
    productId: number;
    slipWeight?: number;
    packagingWeightPerPc?: number;
    packagingQty?: number;
    finalBillableWeight?: number;
}
export declare class CreatePackingSlipDto {
    date: string;
    partyId: number;
    projectId?: number;
    poId?: number;
    remarks?: string;
    vehicleNo?: string;
    slipWeight?: number;
    finalBillableWeight?: number;
    packagingWeightPerPc?: number;
    packagingQty?: number;
    items: PackingSlipItemDto[];
    productSummaries?: PackingSlipProductSummaryDto[];
}
