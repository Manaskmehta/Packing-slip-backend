export declare class CreateProductDto {
    productCode: string;
    productName: string;
    specification?: string;
    description?: string;
    businessLine?: string;
    hsnCode?: string;
    uom?: string;
    defaultBundleQty?: number;
    defaultNoOfBundles?: number;
    isActive?: boolean;
}
export declare class UpdateProductDto extends CreateProductDto {
}
