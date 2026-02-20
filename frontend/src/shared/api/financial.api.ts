import { apiClient } from './client'
import type { PaginatedResponse } from './types'
import { API_ENDPOINTS } from '@/shared/constants/api'
import type {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFilters,
  Balance,
  FinancialSummary,
} from '@/modules/financial/types/financial.types'

// Re-exportar tipos para compatibilidade
export type { Transaction as TransactionResponse }
export type { CreateTransactionDto, UpdateTransactionDto }
export type { TransactionFilters as SearchFilters }

// Flag para rastrear se o endpoint existe (após primeiro 404, não tentar mais)
let transactionsEndpointExists: boolean | null = null

// Função para verificar se o endpoint de transações existe
export function hasTransactionsEndpoint(): boolean {
  return transactionsEndpointExists !== false
}

export const financialApi = {
  // Commands (Write Side)
  create: async (data: CreateTransactionDto): Promise<{ data: Transaction }> => {
    try {
      return await apiClient.post<Transaction>(API_ENDPOINTS.TRANSACTIONS, data)
    } catch (err: any) {
      // Se o endpoint não existir (404), lançar erro com mensagem amigável
      if (err.response?.status === 404 || err.isExpected404) {
        const error = new Error('Endpoint de transações não está disponível no backend. Por favor, verifique se o módulo financeiro foi implementado.')
        ;(error as any).isEndpointNotFound = true
        ;(error as any).isExpected404 = true
        throw error
      }
      throw err
    }
  },

  update: async (id: string, data: UpdateTransactionDto): Promise<{ data: Transaction }> => {
    return apiClient.put<Transaction>(API_ENDPOINTS.TRANSACTION_BY_ID(id), data)
  },

  approve: async (id: string): Promise<{ data: Transaction }> => {
    return apiClient.put<Transaction>(API_ENDPOINTS.TRANSACTION_APPROVE(id))
  },

  reject: async (id: string, reason?: string): Promise<{ data: Transaction }> => {
    return apiClient.put<Transaction>(API_ENDPOINTS.TRANSACTION_REJECT(id), { reason })
  },

  process: async (id: string): Promise<{ data: Transaction }> => {
    return apiClient.put<Transaction>(API_ENDPOINTS.TRANSACTION_PROCESS(id))
  },

  cancel: async (id: string): Promise<{ data: Transaction }> => {
    return apiClient.put<Transaction>(API_ENDPOINTS.TRANSACTION_CANCEL(id))
  },

  // Queries (Read Side)
  list: async (
    companyId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: PaginatedResponse<Transaction> }> => {
    // Se já sabemos que o endpoint não existe, retornar vazio
    if (transactionsEndpointExists === false) {
      return {
        data: {
          data: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      }
    }

    try {
      const response = await apiClient.get<PaginatedResponse<Transaction>>(API_ENDPOINTS.TRANSACTIONS, {
        params: { companyId, page, limit },
      })
      transactionsEndpointExists = true
      return response
    } catch (err: any) {
      if (err.response?.status === 404) {
        transactionsEndpointExists = false
        console.warn('Endpoint de transações não encontrado, retornando lista vazia')
        return {
          data: {
            data: [],
            total: 0,
            page,
            limit,
            totalPages: 0,
          },
        }
      }
      throw err
    }
  },

  getById: async (id: string): Promise<{ data: Transaction }> => {
    try {
      return await apiClient.get<Transaction>(API_ENDPOINTS.TRANSACTION_BY_ID(id))
    } catch (err: any) {
      // Se o endpoint não existir (404), lançar erro normalmente
      // (não retornar dados vazios para getById)
      throw err
    }
  },

  search: async (
    companyId: string,
    filters: TransactionFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: PaginatedResponse<Transaction> }> => {
    // Se já sabemos que o endpoint não existe, retornar vazio
    if (transactionsEndpointExists === false) {
      return {
        data: {
          data: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      }
    }

    try {
      const response = await apiClient.post<PaginatedResponse<Transaction>>(
        `${API_ENDPOINTS.TRANSACTIONS}/search`,
        { companyId, ...filters, page, limit }
      )
      transactionsEndpointExists = true
      return response
    } catch (err: any) {
      if (err.response?.status === 404) {
        transactionsEndpointExists = false
        console.warn('Endpoint de busca de transações não encontrado, retornando lista vazia')
        return {
          data: {
            data: [],
            total: 0,
            page,
            limit,
            totalPages: 0,
          },
        }
      }
      throw err
    }
  },

  getBalance: async (companyId: string, startDate?: string, endDate?: string): Promise<{ data: Balance }> => {
    try {
      return await apiClient.get<Balance>(API_ENDPOINTS.TRANSACTIONS_BALANCE, {
        params: { companyId, startDate, endDate },
      })
    } catch (err: any) {
      // Se o endpoint não existir (404), retornar saldo zerado
      if (err.response?.status === 404) {
        console.warn('Endpoint de saldo não encontrado, retornando saldo zerado')
        return {
          data: {
            companyId,
            totalIncome: 0,
            totalExpense: 0,
            balance: 0,
            currency: 'BRL',
            period: startDate && endDate ? { startDate, endDate } : undefined,
          },
        }
      }
      throw err
    }
  },

  getSummary: async (companyId: string, startDate: string, endDate: string): Promise<{ data: FinancialSummary }> => {
    try {
      return await apiClient.get<FinancialSummary>(API_ENDPOINTS.TRANSACTIONS_SUMMARY, {
        params: { companyId, startDate, endDate },
      })
    } catch (err: any) {
      // Se o endpoint não existir (404), retornar resumo zerado
      if (err.response?.status === 404) {
        console.warn('Endpoint de resumo financeiro não encontrado, retornando resumo zerado')
        return {
          data: {
            companyId,
            period: { startDate, endDate },
            totalIncome: 0,
            totalExpense: 0,
            netBalance: 0,
            pendingIncome: 0,
            pendingExpense: 0,
            transactionsCount: 0,
            currency: 'BRL',
          },
        }
      }
      throw err
    }
  },
}

