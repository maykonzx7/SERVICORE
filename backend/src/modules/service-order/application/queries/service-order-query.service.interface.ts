import { ServiceOrderReadDto } from "./dto/service-order-read.dto";
import { PaginatedResultDto } from "@shared/application/dto";

/**
 * ServiceOrderQueryServiceInterface
 *
 * Interface para serviços de consulta de ordens de serviço.
 * A implementação deve ficar na camada de infraestrutura.
 */
export interface ServiceOrderQueryServiceInterface {
  /**
   * Busca ordens de serviço por empresa com paginação
   * @param companyId ID da empresa
   * @param page Número da página
   * @param limit Itens por página
   * @returns Resultado paginado
   */
  findByCompanyId(
    companyId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResultDto<ServiceOrderReadDto>>;

  /**
   * Busca uma ordem de serviço por ID
   * @param id ID da ordem
   * @returns DTO da ordem ou null
   */
  findById(id: string): Promise<ServiceOrderReadDto | null>;

  /**
   * Busca ordens por status
   * @param status Status da ordem
   * @param page Número da página
   * @param limit Itens por página
   * @returns Resultado paginado
   */
  findByStatus(
    status: string,
    page: number,
    limit: number
  ): Promise<PaginatedResultDto<ServiceOrderReadDto>>;

  /**
   * Busca ordens por prioridade
   * @param priority Prioridade
   * @param page Número da página
   * @param limit Itens por página
   * @returns Resultado paginado
   */
  findByPriority(
    priority: string,
    page: number,
    limit: number
  ): Promise<PaginatedResultDto<ServiceOrderReadDto>>;
}
