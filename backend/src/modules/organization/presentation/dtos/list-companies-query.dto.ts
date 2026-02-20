import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

/**
 * ListCompaniesQueryDto
 *
 * DTO para query parameters de listagem de empresas
 */
export class ListCompaniesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  ownerId?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === undefined || value === null) return undefined;
    return value;
  })
  @IsBoolean()
  active?: boolean;

  @IsString()
  @IsOptional()
  document?: string;

  @IsString()
  @IsOptional()
  sortBy?: "name" | "createdAt" | "document";

  @IsString()
  @IsOptional()
  sortOrder?: "asc" | "desc";
}

