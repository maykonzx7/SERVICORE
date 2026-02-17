import { IsString, IsNumber, IsNotEmpty, Min } from "class-validator";

/**
 * CreateServiceOrderDto
 *
 * DTO para criação de ordem de serviço
 */
export class CreateServiceOrderDto {
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  priority: string;

  @IsNumber()
  @Min(0)
  value: number;
}

