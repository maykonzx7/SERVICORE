import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFinancialStore } from '../stores/financial.store'
import { useCompanyStore } from '@/shared/stores/company.store'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import type { CreateTransactionDto, UpdateTransactionDto, TransactionFilters } from '../types/financial.types'

/**
 * Composable para facilitar uso de Financial Transactions
 */
export function useFinancial() {
  const router = useRouter()
  const financialStore = useFinancialStore()
  const companyStore = useCompanyStore()

  const transactions = computed(() => financialStore.transactions)
  const currentTransaction = computed(() => financialStore.currentTransaction)
  const balance = computed(() => financialStore.balance)
  const summary = computed(() => financialStore.summary)
  const loading = computed(() => financialStore.loading)
  const error = computed(() => financialStore.error)
  const pagination = computed(() => financialStore.pagination)
  const hasTransactions = computed(() => financialStore.hasTransactions)

  async function createTransaction(data: CreateTransactionDto) {
    if (!data.companyId && companyStore.companyId) {
      data.companyId = companyStore.companyId
    }
    return financialStore.createTransaction(data)
  }

  async function loadTransactions(page: number = 1, limit: number = 10) {
    if (!companyStore.companyId) {
      throw new Error('Nenhuma empresa selecionada')
    }
    return financialStore.loadTransactions(companyStore.companyId, page, limit)
  }

  async function searchTransactions(
    companyId: string,
    filters: TransactionFilters,
    page: number = 1,
    limit: number = 10
  ) {
    if (!companyId && companyStore.companyId) {
      companyId = companyStore.companyId
    }
    return financialStore.searchTransactions(companyId, filters, page, limit)
  }

  async function goToDetails(id: string) {
    router.push({
      name: ROUTE_NAMES.TRANSACTION_DETAILS,
      params: { id },
    })
  }

  async function goToCreate() {
    router.push({ name: ROUTE_NAMES.TRANSACTION_CREATE })
  }

  return {
    // State
    transactions,
    currentTransaction,
    balance,
    summary,
    loading,
    error,
    pagination,
    hasTransactions,
    // Actions
    createTransaction,
    updateTransaction: financialStore.updateTransaction,
    loadTransactions,
    searchTransactions,
    loadTransactionById: financialStore.loadTransactionById,
    approveTransaction: financialStore.approveTransaction,
    rejectTransaction: financialStore.rejectTransaction,
    processTransaction: financialStore.processTransaction,
    cancelTransaction: financialStore.cancelTransaction,
    loadBalance: financialStore.loadBalance,
    loadSummary: financialStore.loadSummary,
    clearError: financialStore.clearError,
    // Navigation
    goToDetails,
    goToCreate,
  }
}

