import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInwardDto {
  @IsDateString()
  date: string;

  @IsString()
  challan: string;

  /** Required: party must come from master */
  @IsInt()
  @Type(() => Number)
  partyId: number;

  /** Required: product must come from master */
  @IsInt()
  @Type(() => Number)
  productId: number;

  @IsInt()
  @Type(() => Number)
  inwardQty: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  projectId?: number;

  /** Required: PO must be selected from master */
  @IsInt()
  @Type(() => Number)
  poId: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  kg?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  challanDays?: number;

  @IsString()
  @IsOptional()
  dcLink?: string;

  @IsString()
  @IsOptional()
  specification?: string;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsString()
  @IsOptional()
  year?: string;

  @IsString()
  @IsOptional()
  businessLine?: string;
}

export class UpdateInwardDto extends CreateInwardDto {}
