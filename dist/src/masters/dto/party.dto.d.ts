export declare class CreatePartyDto {
    code?: string;
    name: string;
    address?: string;
    phone?: string;
    gstNo?: string;
    isActive?: boolean;
}
export declare class UpdatePartyDto extends CreatePartyDto {
}
