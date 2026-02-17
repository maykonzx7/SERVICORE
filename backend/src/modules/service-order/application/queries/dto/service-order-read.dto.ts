/**
 * ServiceOrderReadDto
 *
 * DTO para leitura de ordens de serviço.
 * Otimizado para consultas, sem lógica de negócio.
 */
export class ServiceOrderReadDto {
  id: string;
  companyId: string;
  description: string;
  priority: string;
  value: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
