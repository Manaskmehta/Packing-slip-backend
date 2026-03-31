import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  productCode: string;

  @IsString()
  productName: string;

  @IsString()
  @IsOptional()
  specification?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  businessLine?: string;

  @IsString()
  @IsOptional()
  hsnCode?: string;

  @IsString()
  @IsOptional()
  uom?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  defaultBundleQty?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  defaultNoOfBundles?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateProductDto extends CreateProductDto {}
