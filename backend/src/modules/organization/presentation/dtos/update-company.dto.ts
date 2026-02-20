import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  MinLength,
} from "class-validator";

/**
 * UpdateCompanyDto
 *
 * DTO para atualização de empresa
 */
export class UpdateCompanyDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  name?: string;

  @IsString()
  @IsOptional()
  document?: string | null;

  @IsEmail()
  @IsOptional()
  email?: string | null;

  @IsString()
  @IsOptional()
  phone?: string | null;

  @IsString()
  @IsOptional()
  address?: string | null;

  @IsString()
  @IsOptional()
  city?: string | null;

  @IsString()
  @IsOptional()
  state?: string | null;

  @IsString()
  @IsOptional()
  zipCode?: string | null;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

