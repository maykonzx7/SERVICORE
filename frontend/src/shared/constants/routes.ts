// Constantes de rotas

export const ROUTE_NAMES = {
  // Auth
  LOGIN: 'Login',
  REGISTER: 'Register',
  PASSWORD_RESET: 'PasswordReset',
  PASSWORD_RESET_CONFIRM: 'PasswordResetConfirm',
  LOGOUT: 'Logout',
  
  // Dashboard
  DASHBOARD: 'Dashboard',
  HOME: 'Home',
  
  // Service Orders
  SERVICE_ORDERS: 'ServiceOrders',
  SERVICE_ORDER_CREATE: 'ServiceOrderCreate',
  SERVICE_ORDER_DETAILS: 'ServiceOrderDetails',
  
  // Organization
  COMPANY_SELECTION: 'CompanySelection',
  COMPANIES: 'Companies',
  COMPANY_DETAILS: 'CompanyDetails',
  COMPANY_SETTINGS: 'CompanySettings',
  
  // Financial
  FINANCIAL: 'Financial',
  TRANSACTIONS: 'Transactions',
} as const

export const ROUTE_PATHS = {
  LOGIN: '/login',
  REGISTER: '/register',
  PASSWORD_RESET: '/password-reset',
  PASSWORD_RESET_CONFIRM: '/password-reset/:token',
  DASHBOARD: '/dashboard',
  HOME: '/',
  SERVICE_ORDERS: '/service-orders',
  SERVICE_ORDER_CREATE: '/service-orders/create',
  SERVICE_ORDER_DETAILS: '/service-orders/:id',
  COMPANY_SELECTION: '/company-selection',
  COMPANIES: '/companies',
  COMPANY_DETAILS: '/companies/:id',
  COMPANY_SETTINGS: '/companies/:id/settings',
  FINANCIAL: '/financial',
  TRANSACTIONS: '/transactions',
} as const

