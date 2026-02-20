import { Transaction } from "../entities/transaction";
import { TransactionId } from "../value-objects/transaction-id";
import { CompanyId } from "@modules/service-order/domain/value-objects/company-id";
import { ServiceOrderId } from "@modules/service-order/domain/value-objects/service-order-id";
import { TransactionType } from "../value-objects/transaction-type";
import { TransactionStatus } from "../value-objects/transaction-status";

/**
 * TransactionRepository Interface
 *
 * Define o contrato para persistência de Transaction.
 * A implementação deve ficar na camada de infraestrutura.
 */
export interface TransactionRepository {
  /**
   * Salva ou atualiza um aggregate
   * @param transaction Transaction a ser salvo
   * @returns Promise que resolve quando a operação for concluída
   */
  save(transaction: Transaction): Promise<void>;

  /**
   * Busca um aggregate pelo ID
   * @param id ID do aggregate
   * @returns Aggregate encontrado ou null
   */
  findById(id: TransactionId): Promise<Transaction | null>;

  /**
   * Busca todas as transações de uma empresa
   * @param companyId ID da empresa
   * @returns Lista de transações
   */
  findByCompanyId(companyId: CompanyId): Promise<Transaction[]>;

  /**
   * Busca transações por ordem de serviço
   * @param serviceOrderId ID da ordem de serviço
   * @returns Lista de transações
   */
  findByServiceOrderId(
    serviceOrderId: ServiceOrderId
  ): Promise<Transaction[]>;

  /**
   * Busca transações por tipo
   * @param type Tipo da transação
   * @param companyId ID da empresa
   * @returns Lista de transações
   */
  findByType(
    type: TransactionType,
    companyId: CompanyId
  ): Promise<Transaction[]>;

  /**
   * Busca transações por status
   * @param status Status da transação
   * @param companyId ID da empresa
   * @returns Lista de transações
   */
  findByStatus(
    status: TransactionStatus,
    companyId: CompanyId
  ): Promise<Transaction[]>;

  /**
   * Busca transações por intervalo de datas
   * @param companyId ID da empresa
   * @param startDate Data inicial
   * @param endDate Data final
   * @returns Lista de transações
   */
  findByDateRange(
    companyId: CompanyId,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]>;

  /**
   * Verifica se um aggregate existe
   * @param id ID do aggregate
   * @returns true se o aggregate existir
   */
  exists(id: TransactionId): Promise<boolean>;
}

