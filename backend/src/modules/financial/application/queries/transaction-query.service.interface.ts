import { TransactionReadDto } from "./dto/transaction-read.dto";
import { PaginatedResultDto } from "@shared/application/dto";

/**
 * TransactionQueryServiceInterface
 *
 * Interface para serviços de consulta de transações.
 * A implementação deve ficar na camada de infraestrutura.
 */
export interface TransactionQueryServiceInterface {
  /**
   * Busca transações por empresa com paginação
   */
  findByCompanyId(
    companyId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResultDto<TransactionReadDto>>;

  /**
   * Busca uma transação por ID
   */
  findById(id: string): Promise<TransactionReadDto | null>;

  /**
   * Busca transações por tipo
   */
  findByType(
    type: string,
    companyId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResultDto<TransactionReadDto>>;

  /**
   * Busca transações por status
   */
  findByStatus(
    status: string,
    companyId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResultDto<TransactionReadDto>>;

  /**
   * Busca transações por ordem de serviço
   */
  findByServiceOrderId(
    serviceOrderId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResultDto<TransactionReadDto>>;

  /**
   * Busca transações por intervalo de datas
   */
  findByDateRange(
    companyId: string,
    startDate: Date,
    endDate: Date,
    page: number,
    limit: number
  ): Promise<PaginatedResultDto<TransactionReadDto>>;

  /**
   * Busca transações com filtros
   */
  search(
    companyId: string,
    filters: {
      type?: string;
      status?: string;
      serviceOrderId?: string;
      paymentMethod?: string;
      startDate?: Date;
      endDate?: Date;
      search?: string;
    },
    page: number,
    limit: number
  ): Promise<PaginatedResultDto<TransactionReadDto>>;

  /**
   * Calcula o saldo da empresa
   */
  getBalance(
    companyId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    companyId: string;
    totalIncome: number;
    totalExpense: number;
    balance: number;
    currency: string;
    period?: { startDate: Date; endDate: Date };
  }>;

  /**
   * Calcula o resumo financeiro
   */
  getSummary(
    companyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    companyId: string;
    period: { startDate: Date; endDate: Date };
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    pendingIncome: number;
    pendingExpense: number;
    transactionsCount: number;
    currency: string;
  }>;
}

