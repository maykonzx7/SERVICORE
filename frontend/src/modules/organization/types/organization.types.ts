// Tipos específicos do módulo de organização

export interface Company {
  id: string
  name: string
  cnpj?: string
  email?: string
  phone?: string
  address?: Address
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  country?: string
}

export interface CreateCompanyDto {
  name: string
  cnpj?: string
  email?: string
  phone?: string
  address?: Address
}

export interface UpdateCompanyDto {
  name?: string
  cnpj?: string
  email?: string
  phone?: string
  address?: Address
  active?: boolean
}

export interface Department {
  id: string
  companyId: string
  name: string
  description?: string
  parentId?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateDepartmentDto {
  companyId: string
  name: string
  description?: string
  parentId?: string
}

export interface UpdateDepartmentDto {
  name?: string
  description?: string
  parentId?: string
  active?: boolean
}

export interface OrganizationSettings {
  id: string
  companyId: string
  currency: string
  timezone: string
  dateFormat: string
  language: string
  createdAt: string
  updatedAt: string
}

export interface UpdateOrganizationSettingsDto {
  currency?: string
  timezone?: string
  dateFormat?: string
  language?: string
}

export interface CompanyStatistics {
  totalUsers: number
  totalServiceOrders: number
  totalCompletedOrders: number
  totalRevenue: number
  totalTransactions: number
  activeUsers: number
  pendingOrders: number
}

export interface ListCompaniesParams {
  page?: number
  limit?: number
  search?: string
  document?: string
  active?: boolean
  sortBy?: 'name' | 'createdAt' | 'document'
  sortOrder?: 'asc' | 'desc'
}

