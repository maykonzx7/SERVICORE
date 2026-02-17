import { apiClient } from './client'
import type { PaginatedResponse } from './types'
import { API_ENDPOINTS } from '@/shared/constants/api'
import type {
  ServiceOrder,
  CreateServiceOrderDto,
  UpdateServiceOrderDto,
  ServiceOrderFilters,
} from '@/modules/service-orders/types/service-order.types'

// Re-exportar tipos para compatibilidade
export type { ServiceOrder as ServiceOrderResponse }
export type { CreateServiceOrderDto, UpdateServiceOrderDto }
export type { ServiceOrderFilters as SearchFilters }

// Flag para usar mocks (definir em .env)
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

export const serviceOrderApi = {
  // Commands (Write Side)
  create: async (data: CreateServiceOrderDto): Promise<{ data: ServiceOrder }> => {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return {
        data: {
          id: crypto.randomUUID(),
          ...data,
          status: 'CREATED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    return apiClient.post<ServiceOrder>(API_ENDPOINTS.SERVICE_ORDERS, data)
  },

  update: async (id: string, data: UpdateServiceOrderDto): Promise<{ data: ServiceOrder }> => {
    if (USE_MOCKS) {
      return {
        data: {
          id,
          companyId: 'company-1',
          description: data.description || 'Ordem atualizada',
          priority: data.priority || 'MEDIUM',
          value: data.value || 100,
          status: 'CREATED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    return apiClient.put<ServiceOrder>(API_ENDPOINTS.SERVICE_ORDER_BY_ID(id), data)
  },

  start: async (id: string): Promise<{ data: ServiceOrder }> => {
    if (USE_MOCKS) {
      return {
        data: {
          id,
          companyId: 'company-1',
          description: 'Ordem de serviço',
          priority: 'MEDIUM',
          value: 100,
          status: 'STARTED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    return apiClient.put<ServiceOrder>(API_ENDPOINTS.SERVICE_ORDER_START(id))
  },

  complete: async (id: string): Promise<{ data: ServiceOrder }> => {
    if (USE_MOCKS) {
      return {
        data: {
          id,
          companyId: 'company-1',
          description: 'Ordem de serviço',
          priority: 'MEDIUM',
          value: 100,
          status: 'COMPLETED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    return apiClient.put<ServiceOrder>(API_ENDPOINTS.SERVICE_ORDER_COMPLETE(id))
  },

  cancel: async (id: string): Promise<{ data: ServiceOrder }> => {
    if (USE_MOCKS) {
      return {
        data: {
          id,
          companyId: 'company-1',
          description: 'Ordem de serviço',
          priority: 'MEDIUM',
          value: 100,
          status: 'CANCELLED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    return apiClient.put<ServiceOrder>(API_ENDPOINTS.SERVICE_ORDER_CANCEL(id))
  },

  // Queries (Read Side)
  list: async (
    companyId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: PaginatedResponse<ServiceOrder> }> => {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const mockOrders: ServiceOrder[] = Array.from({ length: limit }, (_, i) => ({
        id: `order-${i + 1}`,
        companyId,
        description: `Ordem de serviço ${i + 1}`,
        priority: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][i % 4] as any,
        value: 100 + i * 10,
        status: ['CREATED', 'STARTED', 'IN_PROGRESS', 'COMPLETED'][i % 4] as any,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      }))
      
      return {
        data: {
          data: mockOrders,
          total: 50,
          page,
          limit,
          totalPages: 5,
        },
      }
    }
    return apiClient.get<PaginatedResponse<ServiceOrder>>(API_ENDPOINTS.SERVICE_ORDERS, {
      params: { companyId, page, limit },
    })
  },

  getById: async (id: string): Promise<{ data: ServiceOrder }> => {
    if (USE_MOCKS) {
      return {
        data: {
          id,
          companyId: 'company-1',
          description: 'Ordem de serviço detalhada',
          priority: 'MEDIUM',
          value: 100,
          status: 'CREATED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    return apiClient.get<ServiceOrder>(API_ENDPOINTS.SERVICE_ORDER_BY_ID(id))
  },

  search: async (
    companyId: string,
    filters: ServiceOrderFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: PaginatedResponse<ServiceOrder> }> => {
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
    return apiClient.post<PaginatedResponse<ServiceOrder>>(
      `${API_ENDPOINTS.SERVICE_ORDERS}/search`,
      { companyId, ...filters, page, limit }
    )
  },
}

