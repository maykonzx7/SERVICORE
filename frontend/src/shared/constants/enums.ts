// Constantes e enums compartilhados

export const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Baixa' },
  { value: 'MEDIUM', label: 'Média' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'CRITICAL', label: 'Crítica' },
] as const

export const SERVICE_ORDER_STATUS_OPTIONS = [
  { value: 'CREATED', label: 'Criada' },
  { value: 'STARTED', label: 'Iniciada' },
  { value: 'IN_PROGRESS', label: 'Em Progresso' },
  { value: 'PAUSED', label: 'Pausada' },
  { value: 'COMPLETED', label: 'Concluída' },
  { value: 'CANCELLED', label: 'Cancelada' },
  { value: 'REJECTED', label: 'Rejeitada' },
] as const

export const ROLES = {
  ADMIN: 'ADMIN',
  COMPANY_ADMIN: 'COMPANY_ADMIN',
  MANAGER: 'MANAGER',
  TECHNICIAN: 'TECHNICIAN',
  CLIENT: 'CLIENT',
} as const

export const PERMISSIONS = {
  // Service Order
  SERVICE_ORDER_VIEW: 'service-order:view',
  SERVICE_ORDER_CREATE: 'service-order:create',
  SERVICE_ORDER_UPDATE: 'service-order:update',
  SERVICE_ORDER_DELETE: 'service-order:delete',
  
  // Financial
  FINANCIAL_VIEW: 'financial:view',
  FINANCIAL_APPROVE: 'financial:approve',
} as const

