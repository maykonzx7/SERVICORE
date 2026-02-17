import { ref, computed } from 'vue'
import type {
  TransactionFilters,
  TransactionType,
  TransactionStatus,
  PaymentMethod,
} from '../types/financial.types'

/**
 * Composable para gerenciar filtros de Transaction
 */
export function useTransactionFilters() {
  const filters = ref<TransactionFilters>({
    type: undefined,
    status: undefined,
    paymentMethod: undefined,
    search: undefined,
    startDate: undefined,
    endDate: undefined,
    serviceOrderId: undefined,
  })

  const hasFilters = computed(() => {
    return !!(
      filters.value.type ||
      filters.value.status ||
      filters.value.paymentMethod ||
      filters.value.search ||
      filters.value.startDate ||
      filters.value.endDate ||
      filters.value.serviceOrderId
    )
  })

  function setType(type: TransactionType | undefined) {
    filters.value.type = type
  }

  function setStatus(status: TransactionStatus | undefined) {
    filters.value.status = status
  }

  function setPaymentMethod(method: PaymentMethod | undefined) {
    filters.value.paymentMethod = method
  }

  function setSearch(search: string | undefined) {
    filters.value.search = search
  }

  function setDateRange(startDate: string | undefined, endDate: string | undefined) {
    filters.value.startDate = startDate
    filters.value.endDate = endDate
  }

  function setServiceOrderId(serviceOrderId: string | undefined) {
    filters.value.serviceOrderId = serviceOrderId
  }

  function clearFilters() {
    filters.value = {
      type: undefined,
      status: undefined,
      paymentMethod: undefined,
      search: undefined,
      startDate: undefined,
      endDate: undefined,
      serviceOrderId: undefined,
    }
  }

  return {
    filters,
    hasFilters,
    setType,
    setStatus,
    setPaymentMethod,
    setSearch,
    setDateRange,
    setServiceOrderId,
    clearFilters,
  }
}

