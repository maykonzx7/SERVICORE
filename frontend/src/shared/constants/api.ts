// Constantes de API

export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',
  
  // Service Orders
  SERVICE_ORDERS: '/service-orders',
  SERVICE_ORDER_BY_ID: (id: string) => `/service-orders/${id}`,
  SERVICE_ORDER_START: (id: string) => `/service-orders/${id}/start`,
  SERVICE_ORDER_COMPLETE: (id: string) => `/service-orders/${id}/complete`,
  SERVICE_ORDER_CANCEL: (id: string) => `/service-orders/${id}/cancel`,
  
  // Companies
  COMPANIES: '/companies',
  COMPANY_BY_ID: (id: string) => `/companies/${id}`,
  
  // Financial
  TRANSACTIONS: '/transactions',
  TRANSACTION_BY_ID: (id: string) => `/transactions/${id}`,
  TRANSACTION_APPROVE: (id: string) => `/transactions/${id}/approve`,
  TRANSACTION_REJECT: (id: string) => `/transactions/${id}/reject`,
  TRANSACTION_PROCESS: (id: string) => `/transactions/${id}/process`,
  TRANSACTION_CANCEL: (id: string) => `/transactions/${id}/cancel`,
  TRANSACTIONS_BALANCE: '/transactions/balance',
  TRANSACTIONS_SUMMARY: '/transactions/summary',
} as const

export const API_TIMEOUT = 10000 // 10 segundos

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
} as const

