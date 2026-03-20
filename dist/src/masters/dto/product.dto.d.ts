export declare class CreateProductDto {
    productCode: string;
    productName: string;
    specification?: string;
    description?: string;
    businessLine?: string;
    hsnCode?: string;
    uom?: string;
    isActive?: boolean;
}
export declare class UpdateProductDto extends CreateProductDto {
}
