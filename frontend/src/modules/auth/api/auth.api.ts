import { apiClient } from '@/shared/api/client'
import type { ApiResponse } from '@/shared/api/types'
import { API_ENDPOINTS } from '@/shared/constants/api'
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
  PasswordResetRequest,
  PasswordReset,
  ChangePasswordRequest,
} from '../types/auth.types'

// Flag para usar mocks (definir em .env)
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

export const authApi = {
  /**
   * Realiza login do usuário
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    if (USE_MOCKS) {
      // Mock response para desenvolvimento
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simular delay
      
      return {
        data: {
          token: 'mock-token-' + Date.now(),
          user: {
            id: 'user-1',
            email: credentials.email,
            name: 'Usuário Mock',
            roles: ['USER'],
            permissions: ['service-order:view', 'service-order:create'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      }
    }
    
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH_LOGIN, credentials)
  },

  /**
   * Realiza logout do usuário
   */
  logout: async (): Promise<void> => {
    if (USE_MOCKS) {
      return Promise.resolve()
    }
    
    return apiClient.post(API_ENDPOINTS.AUTH_LOGOUT)
  },

  /**
   * Obtém informações do usuário atual
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    if (USE_MOCKS) {
      return {
        data: {
          id: 'user-1',
          email: 'user@example.com',
          name: 'Usuário Mock',
          roles: ['USER'],
          permissions: ['service-order:view', 'service-order:create'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    
    // O token JWT é enviado automaticamente pelo interceptor do axios
    return apiClient.get<User>(API_ENDPOINTS.AUTH_ME)
  },

  /**
   * Registra novo usuário
   */
  register: async (credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>> => {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      return {
        data: {
          token: 'mock-token-' + Date.now(),
          user: {
            id: 'user-new',
            email: credentials.email,
            name: credentials.name,
            roles: ['USER'],
            permissions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      }
    }
    
    // Remover confirmPassword antes de enviar (não é necessário no backend)
    const { confirmPassword, ...payload } = credentials
    
    return apiClient.post<AuthResponse>('/auth/register', payload)
  },

  /**
   * Solicita reset de senha
   */
  requestPasswordReset: async (data: PasswordResetRequest): Promise<ApiResponse<{ message: string }>> => {
    if (USE_MOCKS) {
      return {
        data: {
          message: 'Email de recuperação enviado',
        },
      }
    }
    
    return apiClient.post('/auth/password/reset-request', data)
  },

  /**
   * Reseta senha com token
   */
  resetPassword: async (data: PasswordReset): Promise<ApiResponse<{ message: string }>> => {
    if (USE_MOCKS) {
      return {
        data: {
          message: 'Senha alterada com sucesso',
        },
      }
    }
    
    return apiClient.post('/auth/password/reset', data)
  },

  /**
   * Altera senha do usuário autenticado
   */
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> => {
    if (USE_MOCKS) {
      return {
        data: {
          message: 'Senha alterada com sucesso',
        },
      }
    }
    
    return apiClient.post('/auth/password/change', data)
  },

  /**
   * Atualiza perfil do usuário
   */
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    if (USE_MOCKS) {
      return {
        data: {
          id: 'user-1',
          email: data.email || 'user@example.com',
          name: data.name || 'Usuário',
          roles: ['USER'],
          permissions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    }
    
    return apiClient.put<User>('/auth/profile', data)
  },
}

