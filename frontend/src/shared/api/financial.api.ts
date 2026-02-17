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

// Flag para usar mocks (definir em .env)
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

export const financialApi = {
  // Commands (Write Side)
  create: async (data: CreateTransactionDto): Promise<{ data: Transaction }> => {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return {
        data: {
          id: crypto.randomUUID(),
          ...data,
          currency: data.currency || 'BRL',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    return apiClient.post<Transaction>(API_ENDPOINTS.TRANSACTIONS, data)
  },

  update: async (id: string, data: UpdateTransactionDto): Promise<{ data: Transaction }> => {
    if (USE_MOCKS) {
      return {
        data: {
          id,
          companyId: 'company-1',
          type: 'INCOME',
          amount: data.amount || 100,
          currency: 'BRL',
          description: data.description || 'Transação atualizada',
          status: 'PENDING',
          paymentMethod: data.paymentMethod || null,
          dueDate: data.dueDate || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    return apiClient.put<Transaction>(API_ENDPOINTS.TRANSACTION_BY_ID(id), data)
  },

  approve: async (id: string): Promise<{ data: Transaction }> => {
    if (USE_MOCKS) {
      return {
        data: {
          id,
          companyId: 'company-1',
          type: 'INCOME',
          amount: 100,
          currency: 'BRL',
          description: 'Transação',
          status: 'APPROVED',
          approvedBy: 'user-1',
          approvedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    return apiClient.put<Transaction>(API_ENDPOINTS.TRANSACTION_APPROVE(id))
  },

  reject: async (id: string, reason?: string): Promise<{ data: Transaction }> => {
    if (USE_MOCKS) {
      return {
        data: {
          id,
          companyId: 'company-1',
          type: 'INCOME',
          amount: 100,
          currency: 'BRL',
          description: 'Transação',
          status: 'REJECTED',
          rejectedReason: reason || 'Rejeitada',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    return apiClient.put<Transaction>(API_ENDPOINTS.TRANSACTION_REJECT(id), { reason })
  },

  process: async (id: string): Promise<{ data: Transaction }> => {
    if (USE_MOCKS) {
      return {
        data: {
          id,
          companyId: 'company-1',
          type: 'INCOME',
          amount: 100,
          currency: 'BRL',
          description: 'Transação',
          status: 'PROCESSED',
          paidAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    return apiClient.put<Transaction>(API_ENDPOINTS.TRANSACTION_PROCESS(id))
  },

  cancel: async (id: string): Promise<{ data: Transaction }> => {
    if (USE_MOCKS) {
      return {
        data: {
          id,
          companyId: 'company-1',
          type: 'INCOME',
          amount: 100,
          currency: 'BRL',
          description: 'Transação',
          status: 'CANCELLED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    return apiClient.put<Transaction>(API_ENDPOINTS.TRANSACTION_CANCEL(id))
  },

  // Queries (Read Side)
  list: async (
    companyId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: PaginatedResponse<Transaction> }> => {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const mockTransactions: Transaction[] = Array.from({ length: limit }, (_, i) => ({
        id: `transaction-${i + 1}`,
        companyId,
        type: i % 2 === 0 ? 'INCOME' : 'EXPENSE',
        amount: 100 + i * 10,
        currency: 'BRL',
        description: `Transação ${i % 2 === 0 ? 'Receita' : 'Despesa'} ${i + 1}`,
        status: ['PENDING', 'APPROVED', 'PROCESSED'][i % 3] as any,
        paymentMethod: i % 2 === 0 ? 'PIX' : 'BANK_TRANSFER',
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      }))
      
      return {
        data: {
          data: mockTransactions,
          total: 50,
          page,
          limit,
          totalPages: 5,
        },
      }
    }
    return apiClient.get<PaginatedResponse<Transaction>>(API_ENDPOINTS.TRANSACTIONS, {
      params: { companyId, page, limit },
    })
  },

  getById: async (id: string): Promise<{ data: Transaction }> => {
    if (USE_MOCKS) {
      return {
        data: {
          id,
          companyId: 'company-1',
          type: 'INCOME',
          amount: 100,
          currency: 'BRL',
          description: 'Transação detalhada',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    return apiClient.get<Transaction>(API_ENDPOINTS.TRANSACTION_BY_ID(id))
  },

  search: async (
    companyId: string,
    filters: TransactionFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: PaginatedResponse<Transaction> }> => {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 300))
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
    return apiClient.post<PaginatedResponse<Transaction>>(
      `${API_ENDPOINTS.TRANSACTIONS}/search`,
      { companyId, ...filters, page, limit }
    )
  },

  getBalance: async (companyId: string, startDate?: string, endDate?: string): Promise<{ data: Balance }> => {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      return {
        data: {
          companyId,
          totalIncome: 5000,
          totalExpense: 3000,
          balance: 2000,
          currency: 'BRL',
          period: startDate && endDate ? { startDate, endDate } : undefined,
        },
      }
    }
    return apiClient.get<Balance>(API_ENDPOINTS.TRANSACTIONS_BALANCE, {
      params: { companyId, startDate, endDate },
    })
  },

  getSummary: async (companyId: string, startDate: string, endDate: string): Promise<{ data: FinancialSummary }> => {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      return {
        data: {
          companyId,
          period: { startDate, endDate },
          totalIncome: 5000,
          totalExpense: 3000,
          netBalance: 2000,
          pendingIncome: 500,
          pendingExpense: 200,
          transactionsCount: 25,
          currency: 'BRL',
        },
      }
    }
    return apiClient.get<FinancialSummary>(API_ENDPOINTS.TRANSACTIONS_SUMMARY, {
      params: { companyId, startDate, endDate },
    })
  },
}

