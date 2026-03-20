import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreatePartyDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  gstNo?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdatePartyDto extends CreatePartyDto {}
