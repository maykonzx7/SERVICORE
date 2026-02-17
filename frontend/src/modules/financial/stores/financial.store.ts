import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { financialApi } from '@/shared/api/financial.api'
import type {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFilters,
  Balance,
  FinancialSummary,
} from '../types/financial.types'
import type { PaginatedResponse } from '@/shared/api/types'

export const useFinancialStore = defineStore('financial', () => {
  // ========== STATE ==========
  const transactions = ref<Transaction[]>([])
  const currentTransaction = ref<Transaction | null>(null)
  const balance = ref<Balance | null>(null)
  const summary = ref<FinancialSummary | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })

  // ========== GETTERS ==========
  const hasTransactions = computed(() => transactions.value.length > 0)
  const isLoading = computed(() => loading.value)

  // ========== ACTIONS ==========
  async function createTransaction(data: CreateTransactionDto): Promise<Transaction> {
    loading.value = true
    error.value = null
    try {
      const response = await financialApi.create(data)
      transactions.value.unshift(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao criar transação'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTransaction(id: string, data: UpdateTransactionDto): Promise<Transaction> {
    loading.value = true
    error.value = null
    try {
      const response = await financialApi.update(id, data)
      updateTransactionInList(response.data)
      if (currentTransaction.value?.id === id) {
        currentTransaction.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao atualizar transação'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadTransactions(
    companyId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Transaction>> {
    loading.value = true
    error.value = null
    try {
      const response = await financialApi.list(companyId, page, limit)
      const result = response.data
      transactions.value = result.data
      pagination.value = {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      }
      return result
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar transações'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function searchTransactions(
    companyId: string,
    filters: TransactionFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Transaction>> {
    loading.value = true
    error.value = null
    try {
      const response = await financialApi.search(companyId, filters, page, limit)
      const result = response.data
      transactions.value = result.data
      pagination.value = {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      }
      return result
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao buscar transações'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadTransactionById(id: string): Promise<Transaction> {
    loading.value = true
    error.value = null
    try {
      const response = await financialApi.getById(id)
      currentTransaction.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar transação'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function approveTransaction(id: string): Promise<Transaction> {
    loading.value = true
    error.value = null
    try {
      const response = await financialApi.approve(id)
      updateTransactionInList(response.data)
      if (currentTransaction.value?.id === id) {
        currentTransaction.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao aprovar transação'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function rejectTransaction(id: string, reason?: string): Promise<Transaction> {
    loading.value = true
    error.value = null
    try {
      const response = await financialApi.reject(id, reason)
      updateTransactionInList(response.data)
      if (currentTransaction.value?.id === id) {
        currentTransaction.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao rejeitar transação'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function processTransaction(id: string): Promise<Transaction> {
    loading.value = true
    error.value = null
    try {
      const response = await financialApi.process(id)
      updateTransactionInList(response.data)
      if (currentTransaction.value?.id === id) {
        currentTransaction.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao processar transação'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelTransaction(id: string): Promise<Transaction> {
    loading.value = true
    error.value = null
    try {
      const response = await financialApi.cancel(id)
      updateTransactionInList(response.data)
      if (currentTransaction.value?.id === id) {
        currentTransaction.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao cancelar transação'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadBalance(companyId: string, startDate?: string, endDate?: string): Promise<Balance> {
    loading.value = true
    error.value = null
    try {
      const response = await financialApi.getBalance(companyId, startDate, endDate)
      balance.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar saldo'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadSummary(companyId: string, startDate: string, endDate: string): Promise<FinancialSummary> {
    loading.value = true
    error.value = null
    try {
      const response = await financialApi.getSummary(companyId, startDate, endDate)
      summary.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar resumo financeiro'
      throw err
    } finally {
      loading.value = false
    }
  }

  function updateTransactionInList(updatedTransaction: Transaction) {
    const index = transactions.value.findIndex((t) => t.id === updatedTransaction.id)
    if (index !== -1) {
      transactions.value[index] = updatedTransaction
    } else {
      // Se não está na lista, adicionar
      transactions.value.unshift(updatedTransaction)
    }
  }

  function clearError() {
    error.value = null
  }

  function reset() {
    transactions.value = []
    currentTransaction.value = null
    balance.value = null
    summary.value = null
    error.value = null
    pagination.value = {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    }
  }

  // ========== RETURN ==========
  return {
    // State
    transactions,
    currentTransaction,
    balance,
    summary,
    loading,
    error,
    pagination,
    // Getters
    hasTransactions,
    isLoading,
    // Actions
    createTransaction,
    updateTransaction,
    loadTransactions,
    searchTransactions,
    loadTransactionById,
    approveTransaction,
    rejectTransaction,
    processTransaction,
    cancelTransaction,
    loadBalance,
    loadSummary,
    clearError,
    reset,
  }
})

