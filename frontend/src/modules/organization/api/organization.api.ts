import { apiClient } from '@/shared/api/client'
import type { PaginatedResponse, ApiResponse } from '@/shared/api/types'
import { API_ENDPOINTS } from '@/shared/constants/api'
import type {
  Company,
  CreateCompanyDto,
  UpdateCompanyDto,
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  OrganizationSettings,
  UpdateOrganizationSettingsDto,
} from '../types/organization.types'

// Flag para usar mocks (definir em .env)
// Por padrão, usar API real (mocks apenas se explicitamente habilitado)
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

console.log('[MOCK] USE_MOCKS:', USE_MOCKS, 'MODE:', import.meta.env.MODE, 'DEV:', import.meta.env.DEV)

/**
 * Mapeia resposta do backend (document) para frontend (cnpj)
 */
function mapBackendCompanyToFrontend(backendCompany: any): Company {
  return {
    ...backendCompany,
    cnpj: backendCompany.document || undefined,
  }
}

/**
 * Mapeia dados do frontend (cnpj) para backend (document)
 */
function mapFrontendCompanyToBackend(data: CreateCompanyDto | UpdateCompanyDto): any {
  const payload: any = {
    ...data,
  }
  
  // Mapear cnpj para document
  if ('cnpj' in payload) {
    payload.document = payload.cnpj || undefined
    delete payload.cnpj
  }
  
  // Remover campos undefined e strings vazias
  Object.keys(payload).forEach(key => {
    if (payload[key] === undefined || payload[key] === '') {
      delete payload[key]
    }
  })
  
  return payload
}

export const organizationApi = {
  /**
   * Lista empresas do usuário autenticado com filtros e paginação
   */
  listCompanies: async (params?: {
    page?: number
    limit?: number
    search?: string
    document?: string
    active?: boolean
    sortBy?: 'name' | 'createdAt' | 'document'
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<Company>> => {
    if (USE_MOCKS) {
      console.log('[MOCK] listCompanies - Usando mocks')
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      // Retornar empresa mock por padrão
      const mockCompany: Company = {
        id: 'company-1',
        name: 'Empresa Exemplo',
        cnpj: '12345678000190',
        email: 'contato@empresaexemplo.com',
        phone: '11987654321',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      // Verificar se há empresas criadas no localStorage (para simular persistência)
      const storedCompanies = localStorage.getItem('mock_companies')
      if (storedCompanies) {
        try {
          const companies = JSON.parse(storedCompanies)
          // Se há empresas salvas, retornar elas
          if (companies.length > 0) {
            console.log('[MOCK] Retornando empresas do localStorage:', companies.length)
            return { data: companies }
          }
        } catch (e) {
          console.warn('[MOCK] Erro ao parsear empresas do localStorage:', e)
          // Se erro ao parsear, usar mock padrão
        }
      }
      
      // Sempre retornar pelo menos uma empresa mock
      console.log('[MOCK] Retornando empresa mock padrão')
      return { data: [mockCompany] }
    }
    
    console.log('[API] listCompanies - Usando API real')
    const response = await apiClient.get<any>(API_ENDPOINTS.COMPANIES, { params })
    // Mapear document para cnpj
    // Backend retorna { data: [...], pagination: {...} }
    let companiesArray: Company[] = []
    let pagination = { page: 1, limit: 10, total: 0, totalPages: 0 }
    
    if (response.data?.data && Array.isArray(response.data.data)) {
      // Backend retornou { data: [...], pagination: {...} }
      companiesArray = response.data.data.map(mapBackendCompanyToFrontend)
      pagination = response.data.pagination || pagination
    } else if (Array.isArray(response.data)) {
      // Backend retornou array diretamente
      companiesArray = response.data.map(mapBackendCompanyToFrontend)
    }
    
    // Retornar no formato paginado
    return { data: companiesArray, pagination } as PaginatedResponse<Company>
  },

  /**
   * Obtém estatísticas da empresa
   */
  getCompanyStatistics: async (companyId: string): Promise<ApiResponse<CompanyStatistics>> => {
    const response = await apiClient.get<any>(`${API_ENDPOINTS.COMPANY_BY_ID(companyId)}/statistics`)
    return response as ApiResponse<CompanyStatistics>
  },

  /**
   * Obtém empresa por ID
   */
  getCompanyById: async (id: string): Promise<ApiResponse<Company>> => {
    if (USE_MOCKS) {
      return {
        data: {
          id,
          name: 'Empresa Exemplo',
          cnpj: '12345678000190',
          email: 'contato@empresaexemplo.com',
          phone: '11987654321',
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    
    const response = await apiClient.get<any>(API_ENDPOINTS.COMPANY_BY_ID(id))
    // Mapear document para cnpj
    if (response.data) {
      response.data = mapBackendCompanyToFrontend(response.data)
    }
    return response as ApiResponse<Company>
  },

  /**
   * Cria nova empresa
   */
  createCompany: async (data: CreateCompanyDto): Promise<ApiResponse<Company>> => {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      const newCompany: Company = {
        id: `company-${Date.now()}`,
        ...data,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      // Salvar no localStorage para simular persistência
      const storedCompanies = localStorage.getItem('mock_companies')
      let companies: Company[] = []
      if (storedCompanies) {
        try {
          companies = JSON.parse(storedCompanies)
        } catch {
          // Se erro, começar com lista vazia
        }
      } else {
        // Se não há empresas salvas, incluir a empresa mock padrão
        companies = [{
          id: 'company-1',
          name: 'Empresa Exemplo',
          cnpj: '12345678000190',
          email: 'contato@empresaexemplo.com',
          phone: '11987654321',
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }]
      }
      
      companies.push(newCompany)
      localStorage.setItem('mock_companies', JSON.stringify(companies))
      
      return { data: newCompany }
    }
    
    // Mapear cnpj para document (backend espera 'document')
    const payload = mapFrontendCompanyToBackend(data)
    
    const response = await apiClient.post<any>(API_ENDPOINTS.COMPANIES, payload)
    // Mapear document para cnpj na resposta
    if (response.data) {
      response.data = mapBackendCompanyToFrontend(response.data)
    }
    return response as ApiResponse<Company>
  },

  /**
   * Atualiza empresa
   */
  updateCompany: async (id: string, data: UpdateCompanyDto): Promise<ApiResponse<Company>> => {
    if (USE_MOCKS) {
      return {
        data: {
          id,
          name: data.name || 'Empresa Atualizada',
          cnpj: data.cnpj,
          email: data.email,
          phone: data.phone,
          active: data.active ?? true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    
    // Mapear cnpj para document (backend espera 'document')
    const payload = mapFrontendCompanyToBackend(data)
    
    const response = await apiClient.put<any>(API_ENDPOINTS.COMPANY_BY_ID(id), payload)
    // Mapear document para cnpj na resposta
    if (response.data) {
      response.data = mapBackendCompanyToFrontend(response.data)
    }
    return response as ApiResponse<Company>
  },

  /**
   * Lista departamentos de uma empresa
   */
  listDepartments: async (companyId: string): Promise<ApiResponse<Department[]>> => {
    if (USE_MOCKS) {
      return {
        data: [],
      }
    }
    
    return apiClient.get<Department[]>(`${API_ENDPOINTS.COMPANIES}/${companyId}/departments`)
  },

  /**
   * Cria departamento
   */
  createDepartment: async (data: CreateDepartmentDto): Promise<ApiResponse<Department>> => {
    if (USE_MOCKS) {
      return {
        data: {
          id: 'dept-new',
          ...data,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    
    return apiClient.post<Department>(
      `${API_ENDPOINTS.COMPANIES}/${data.companyId}/departments`,
      data
    )
  },

  /**
   * Obtém configurações organizacionais
   */
  getSettings: async (companyId: string): Promise<ApiResponse<OrganizationSettings>> => {
    if (USE_MOCKS) {
      return {
        data: {
          id: 'settings-1',
          companyId,
          currency: 'BRL',
          timezone: 'America/Sao_Paulo',
          dateFormat: 'DD/MM/YYYY',
          language: 'pt-BR',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    
    return apiClient.get<OrganizationSettings>(
      `${API_ENDPOINTS.COMPANIES}/${companyId}/settings`
    )
  },

  /**
   * Atualiza configurações organizacionais
   */
  updateSettings: async (
    companyId: string,
    data: UpdateOrganizationSettingsDto
  ): Promise<ApiResponse<OrganizationSettings>> => {
    if (USE_MOCKS) {
      return {
        data: {
          id: 'settings-1',
          companyId,
          currency: data.currency || 'BRL',
          timezone: data.timezone || 'America/Sao_Paulo',
          dateFormat: data.dateFormat || 'DD/MM/YYYY',
          language: data.language || 'pt-BR',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    
    return apiClient.put<OrganizationSettings>(
      `${API_ENDPOINTS.COMPANIES}/${companyId}/settings`,
      data
    )
  },
}

