import { apiClient } from './client'
import type { PaginatedResponse } from './types'
import { API_ENDPOINTS } from '@/shared/constants/api'
import type {
  ServiceOrder,
  CreateServiceOrderDto,
  UpdateServiceOrderDto,
  ServiceOrderFilters,
  ServiceOrderHistory,
} from '@/modules/service-orders/types/service-order.types'

// Re-exportar tipos para compatibilidade
export type { ServiceOrder as ServiceOrderResponse }
export type { CreateServiceOrderDto, UpdateServiceOrderDto }
export type { ServiceOrderFilters as SearchFilters }

export const serviceOrderApi = {
  // Commands (Write Side)
  create: async (data: CreateServiceOrderDto): Promise<{ data: ServiceOrder }> => {
    return apiClient.post<ServiceOrder>(API_ENDPOINTS.SERVICE_ORDERS, data)
  },

  update: async (id: string, data: UpdateServiceOrderDto): Promise<{ data: ServiceOrder }> => {
    return apiClient.put<ServiceOrder>(API_ENDPOINTS.SERVICE_ORDER_BY_ID(id), data)
  },

  start: async (id: string): Promise<{ data: ServiceOrder }> => {
    return apiClient.put<ServiceOrder>(API_ENDPOINTS.SERVICE_ORDER_START(id))
  },

  complete: async (id: string): Promise<{ data: ServiceOrder }> => {
    return apiClient.put<ServiceOrder>(API_ENDPOINTS.SERVICE_ORDER_COMPLETE(id))
  },

  cancel: async (id: string): Promise<{ data: ServiceOrder }> => {
    return apiClient.put<ServiceOrder>(API_ENDPOINTS.SERVICE_ORDER_CANCEL(id))
  },

  // Queries (Read Side)
  list: async (
    companyId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: PaginatedResponse<ServiceOrder> }> => {
    return apiClient.get<PaginatedResponse<ServiceOrder>>(API_ENDPOINTS.SERVICE_ORDERS, {
      params: { companyId, page, limit },
    })
  },

  getById: async (id: string): Promise<{ data: ServiceOrder }> => {
    return apiClient.get<ServiceOrder>(API_ENDPOINTS.SERVICE_ORDER_BY_ID(id))
  },

  search: async (
    companyId: string,
    filters: ServiceOrderFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: PaginatedResponse<ServiceOrder> }> => {
    return apiClient.post<PaginatedResponse<ServiceOrder>>(
      `${API_ENDPOINTS.SERVICE_ORDERS}/search`,
      { companyId, ...filters, page, limit }
    )
  },

  // Assignment (Atribuição)
  assign: async (id: string, userId: string, type: 'PRIMARY' | 'AUXILIARY' | 'OBSERVER' = 'PRIMARY'): Promise<{ data: ServiceOrder }> => {
    return apiClient.post<ServiceOrder>(`${API_ENDPOINTS.SERVICE_ORDER_BY_ID(id)}/assign`, { userId, type })
  },

  unassign: async (id: string, userId: string): Promise<{ data: ServiceOrder }> => {
    return apiClient.delete<ServiceOrder>(`${API_ENDPOINTS.SERVICE_ORDER_BY_ID(id)}/assign/${userId}`)
  },

  // History (Histórico)
  getHistory: async (id: string): Promise<{ data: ServiceOrderHistory[] }> => {
    try {
      return await apiClient.get<ServiceOrderHistory[]>(`${API_ENDPOINTS.SERVICE_ORDER_BY_ID(id)}/history`)
    } catch (err: any) {
      // Se o endpoint não existir (404), retornar array vazio silenciosamente
      if (err.response?.status === 404) {
        console.warn('Endpoint de histórico não encontrado, retornando histórico vazio')
        return { data: [] }
      }
      throw err
    }
  },
}

