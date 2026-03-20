export declare class CreateInwardDto {
    date: string;
    challan: string;
    partyId: number;
    productId: number;
    inwardQty: number;
    projectId?: number;
    poId: number;
    kg?: number;
    challanDays?: number;
    dcLink?: string;
    specification?: string;
    remarks?: string;
    year?: string;
    businessLine?: string;
}
export declare class UpdateInwardDto extends CreateInwardDto {
}
