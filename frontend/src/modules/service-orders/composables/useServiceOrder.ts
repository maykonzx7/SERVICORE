import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useServiceOrderStore } from '../stores/service-order.store'
import { useCompanyStore } from '@/shared/stores/company.store'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import type { CreateServiceOrderDto, UpdateServiceOrderDto } from '../types/service-order.types'

/**
 * Composable para facilitar uso de Service Orders
 */
export function useServiceOrder() {
  const router = useRouter()
  const serviceOrderStore = useServiceOrderStore()
  const companyStore = useCompanyStore()

  const orders = computed(() => serviceOrderStore.orders)
  const currentOrder = computed(() => serviceOrderStore.currentOrder)
  const loading = computed(() => serviceOrderStore.loading)
  const error = computed(() => serviceOrderStore.error)
  const pagination = computed(() => serviceOrderStore.pagination)
  const hasOrders = computed(() => serviceOrderStore.hasOrders)

  async function createOrder(data: CreateServiceOrderDto) {
    if (!data.companyId && companyStore.companyId) {
      data.companyId = companyStore.companyId
    }
    return serviceOrderStore.createOrder(data)
  }

  async function loadOrders(page: number = 1, limit: number = 10) {
    if (!companyStore.companyId) {
      throw new Error('Nenhuma empresa selecionada')
    }
    return serviceOrderStore.loadOrders(companyStore.companyId, page, limit)
  }

  async function searchOrders(
    companyId: string,
    filters: any,
    page: number = 1,
    limit: number = 10
  ) {
    if (!companyId && companyStore.companyId) {
      companyId = companyStore.companyId
    }
    return serviceOrderStore.searchOrders(companyId, filters, page, limit)
  }

  async function goToDetails(id: string) {
    router.push({
      name: ROUTE_NAMES.SERVICE_ORDER_DETAILS,
      params: { id },
    })
  }

  async function goToCreate() {
    router.push({ name: ROUTE_NAMES.SERVICE_ORDER_CREATE })
  }

  function goToOrders() {
    router.push({ name: ROUTE_NAMES.SERVICE_ORDERS })
  }

  return {
    // State
    orders,
    currentOrder,
    loading,
    error,
    pagination,
    hasOrders,
    // Actions
    createOrder,
    updateOrder: serviceOrderStore.updateOrder,
    loadOrders,
    searchOrders,
    loadOrderById: serviceOrderStore.loadOrderById,
    startOrder: serviceOrderStore.startOrder,
    completeOrder: serviceOrderStore.completeOrder,
    cancelOrder: serviceOrderStore.cancelOrder,
    clearError: serviceOrderStore.clearError,
    // Navigation
    goToDetails,
    goToCreate,
    goToOrders,
  }
}


