import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  partyId?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateProjectDto extends CreateProjectDto {}
