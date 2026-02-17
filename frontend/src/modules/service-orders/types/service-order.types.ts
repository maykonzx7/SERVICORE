// Tipos específicos do módulo de service orders

export interface ServiceOrder {
  id: string
  companyId: string
  description: string
  priority: Priority
  value: number
  status: ServiceOrderStatus
  createdAt: string
  updatedAt: string
}

export interface CreateServiceOrderDto {
  companyId: string
  description: string
  priority: Priority
  value: number
}

export interface UpdateServiceOrderDto {
  description?: string
  priority?: Priority
  value?: number
}

export interface ServiceOrderFilters {
  status?: ServiceOrderStatus
  priority?: Priority
  search?: string
  startDate?: string
  endDate?: string
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type ServiceOrderStatus =
  | 'CREATED'
  | 'STARTED'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED'

export interface ServiceOrderHistory {
  id: string
  serviceOrderId: string
  action: string
  performedBy: string
  performedAt: string
  changes?: Record<string, { from: any; to: any }>
}


