import { ref, computed } from 'vue'
import type { ServiceOrderFilters, Priority, ServiceOrderStatus } from '../types/service-order.types'

/**
 * Composable para gerenciar filtros de Service Order
 */
export function useServiceOrderFilters() {
  const filters = ref<ServiceOrderFilters>({
    status: undefined,
    priority: undefined,
    search: undefined,
    startDate: undefined,
    endDate: undefined,
  })

  const hasFilters = computed(() => {
    return !!(
      filters.value.status ||
      filters.value.priority ||
      filters.value.search ||
      filters.value.startDate ||
      filters.value.endDate
    )
  })

  function setStatus(status: ServiceOrderStatus | undefined) {
    filters.value.status = status
  }

  function setPriority(priority: Priority | undefined) {
    filters.value.priority = priority
  }

  function setSearch(search: string | undefined) {
    filters.value.search = search
  }

  function setDateRange(startDate: string | undefined, endDate: string | undefined) {
    filters.value.startDate = startDate
    filters.value.endDate = endDate
  }

  function clearFilters() {
    filters.value = {
      status: undefined,
      priority: undefined,
      search: undefined,
      startDate: undefined,
      endDate: undefined,
    }
  }

  return {
    filters,
    hasFilters,
    setStatus,
    setPriority,
    setSearch,
    setDateRange,
    clearFilters,
  }
}


