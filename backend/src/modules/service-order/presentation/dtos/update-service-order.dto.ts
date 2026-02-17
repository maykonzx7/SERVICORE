import { IsString, IsNumber, IsOptional, Min } from "class-validator";

/**
 * UpdateServiceOrderDto
 *
 * DTO para atualização de ordem de serviço
 */
export class UpdateServiceOrderDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  value?: number;
}

