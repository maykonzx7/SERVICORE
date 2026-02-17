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
  FINANCIAL_CREATE: 'financial:create',
  FINANCIAL_UPDATE: 'financial:update',
  FINANCIAL_DELETE: 'financial:delete',
  FINANCIAL_APPROVE: 'financial:approve',
  FINANCIAL_PROCESS: 'financial:process',
} as const

export const TRANSACTION_TYPE_OPTIONS = [
  { value: 'INCOME', label: 'Receita' },
  { value: 'EXPENSE', label: 'Despesa' },
] as const

export const TRANSACTION_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'APPROVED', label: 'Aprovada' },
  { value: 'REJECTED', label: 'Rejeitada' },
  { value: 'PROCESSED', label: 'Processada' },
  { value: 'CANCELLED', label: 'Cancelada' },
] as const

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'CASH', label: 'Dinheiro' },
  { value: 'CREDIT_CARD', label: 'Cartão de Crédito' },
  { value: 'DEBIT_CARD', label: 'Cartão de Débito' },
  { value: 'BANK_TRANSFER', label: 'Transferência Bancária' },
  { value: 'PIX', label: 'PIX' },
  { value: 'CHECK', label: 'Cheque' },
  { value: 'OTHER', label: 'Outro' },
] as const

