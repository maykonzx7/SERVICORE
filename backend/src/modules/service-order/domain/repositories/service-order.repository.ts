import { ServiceOrder } from "../entities/service-order";
import { ServiceOrderId } from "../value-objects/service-order-id";
import { CompanyId } from "../value-objects/company-id";

/**
 * ServiceOrderRepository Interface
 *
 * Define o contrato para persistência de ServiceOrder.
 * A implementação deve ficar na camada de infraestrutura.
 */
export interface ServiceOrderRepository {
  /**
   * Salva ou atualiza um aggregate
   * @param order ServiceOrder a ser salvo
   * @returns Promise que resolve quando a operação for concluída
   */
  save(order: ServiceOrder): Promise<void>;

  /**
   * Busca um aggregate pelo ID
   * @param id ID do aggregate
   * @returns Aggregate encontrado ou null
   */
  findById(id: ServiceOrderId): Promise<ServiceOrder | null>;

  /**
   * Busca todas as ordens de uma empresa
   * @param companyId ID da empresa
   * @returns Lista de ordens de serviço
   */
  findByCompanyId(companyId: CompanyId): Promise<ServiceOrder[]>;

  /**
   * Remove um aggregate
   * @param id ID do aggregate a ser removido
   * @returns Promise que resolve quando a operação for concluída
   */
  delete(id: ServiceOrderId): Promise<void>;

  /**
   * Verifica se um aggregate existe
   * @param id ID do aggregate
   * @returns true se o aggregate existir
   */
  exists(id: ServiceOrderId): Promise<boolean>;
}
