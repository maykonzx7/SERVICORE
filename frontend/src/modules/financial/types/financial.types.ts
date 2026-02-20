// Tipos específicos do módulo financial

export interface Transaction {
  id: string
  companyId: string
  serviceOrderId?: string | null
  type: TransactionType
  amount: number
  currency: string
  description: string
  status: TransactionStatus
  paymentMethod?: PaymentMethod | null
  dueDate?: string | null
  paidAt?: string | null
  approvedBy?: string | null
  approvedAt?: string | null
  rejectedReason?: string | null
  createdAt: string
  updatedAt: string
  // Relacionamentos (opcionais, podem vir do backend)
  serviceOrder?: {
    id: string
    description: string
    status: string
  } | null
}

export interface CreateTransactionDto {
  companyId: string
  serviceOrderId?: string | null
  type: TransactionType
  amount: number
  currency?: string
  description: string
  paymentMethod?: PaymentMethod | null
  dueDate?: string | null
}

export interface UpdateTransactionDto {
  amount?: number
  description?: string
  paymentMethod?: PaymentMethod | null
  dueDate?: string | null
  serviceOrderId?: string | null
}

export interface TransactionFilters {
  type?: TransactionType
  status?: TransactionStatus
  paymentMethod?: PaymentMethod
  search?: string
  startDate?: string
  endDate?: string
  serviceOrderId?: string
}

export type TransactionType = 'INCOME' | 'EXPENSE'

export type TransactionStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'PROCESSED'
  | 'CANCELLED'

export type PaymentMethod =
  | 'CASH'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'BANK_TRANSFER'
  | 'PIX'
  | 'CHECK'
  | 'OTHER'

export interface TransactionHistory {
  id: string
  transactionId: string
  action: string
  performedBy: string
  performedAt: string
  changes?: Record<string, { from: any; to: any }>
}

export interface Balance {
  companyId: string
  totalIncome: number
  totalExpense: number
  balance: number
  currency: string
  period?: {
    startDate: string
    endDate: string
  }
}

export interface FinancialSummary {
  companyId: string
  period: {
    startDate: string
    endDate: string
  }
  totalIncome: number
  totalExpense: number
  netBalance: number
  pendingIncome: number
  pendingExpense: number
  transactionsCount: number
  currency: string
}

