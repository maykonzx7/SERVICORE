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
  // Atribuições (técnicos, clientes, etc)
  assignments?: Assignment[]
  // Cliente (se aplicável)
  clientId?: string
  client?: {
    id: string
    name: string
    email?: string
    phone?: string
  }
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

export interface Assignment {
  id: string
  userId: string
  userName: string
  userEmail?: string
  type: AssignmentType
  assignedAt: string
  assignedBy?: string
}

export type AssignmentType = 'PRIMARY' | 'AUXILIARY' | 'OBSERVER'

export interface ServiceOrderHistory {
  id: string
  serviceOrderId: string
  action: string
  performedBy: string
  performedByName?: string
  performedAt: string
  changes?: Record<string, { from: any; to: any }>
  description?: string
}


