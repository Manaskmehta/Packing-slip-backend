export declare class CreatePoDto {
    poNumber: string;
    imageLink?: string;
    date?: string;
    partyId?: number;
    projectId?: number;
    isActive?: boolean;
}
export declare class UpdatePoDto extends CreatePoDto {
}
