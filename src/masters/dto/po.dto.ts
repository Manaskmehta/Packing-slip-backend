import { IsBoolean, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePoDto {
  @IsString()
  poNumber: string;

  @IsString()
  @IsOptional()
  imageLink?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  partyId?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  projectId?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdatePoDto extends CreatePoDto {}
