import { IsBoolean, IsOptional, IsString } from 'class-validator';

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

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateProductDto extends CreateProductDto {}
