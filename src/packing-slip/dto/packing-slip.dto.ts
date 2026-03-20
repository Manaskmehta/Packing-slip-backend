import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PackingSlipItemDto {
  /** Required: product must come from master */
  @IsInt()
  @Type(() => Number)
  productId: number;

  /** DC / Inward Challan reference for this specific line item */
  @IsString()
  @IsOptional()
  dcLink?: string;

  /** Per-line overrides (may differ from product master defaults) */
  @IsString()
  @IsOptional()
  specification?: string;

  @IsString()
  @IsOptional()
  businessLine?: string;

  @IsInt()
  @Type(() => Number)
  qty: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  kg?: number;

  // Bundle tracking
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  bundleQty?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  noOfBundles?: number;

  // Per-row packaging / weight
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  packagingWeightPerPc?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  packagingQty?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  slipWeight?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  finalBillableWeight?: number;
}

export class PackingSlipProductSummaryDto {
  @IsInt()
  @Type(() => Number)
  productId: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  slipWeight?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  packagingWeightPerPc?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  packagingQty?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  finalBillableWeight?: number;
}

export class CreatePackingSlipDto {
  @IsDateString()
  date: string;

  /** Required: party must come from master */
  @IsInt()
  @Type(() => Number)
  partyId: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  projectId?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  poId?: number;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsString()
  @IsOptional()
  vehicleNo?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  slipWeight?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  finalBillableWeight?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  packagingWeightPerPc?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  packagingQty?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackingSlipItemDto)
  items: PackingSlipItemDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PackingSlipProductSummaryDto)
  productSummaries?: PackingSlipProductSummaryDto[];
}
