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
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

export const organizationApi = {
  /**
   * Lista empresas do usuário autenticado
   */
  listCompanies: async (): Promise<ApiResponse<Company[]>> => {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      return {
        data: [
          {
            id: 'company-1',
            name: 'Empresa Exemplo',
            cnpj: '12345678000190',
            email: 'contato@empresaexemplo.com',
            phone: '11987654321',
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      }
    }
    
    return apiClient.get<Company[]>(API_ENDPOINTS.COMPANIES)
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
    
    return apiClient.get<Company>(API_ENDPOINTS.COMPANY_BY_ID(id))
  },

  /**
   * Cria nova empresa
   */
  createCompany: async (data: CreateCompanyDto): Promise<ApiResponse<Company>> => {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      return {
        data: {
          id: 'company-new',
          ...data,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    
    return apiClient.post<Company>(API_ENDPOINTS.COMPANIES, data)
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
    
    return apiClient.put<Company>(API_ENDPOINTS.COMPANY_BY_ID(id), data)
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

