import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import type { AxiosResponse, AxiosError } from 'axios'

// Instância base do Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor - Adiciona token de autenticação
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Buscar token do localStorage (evita dependência circular com store)
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// Response Interceptor - Trata erros globais
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido - limpar dados e redirecionar
      localStorage.removeItem('token')
      localStorage.removeItem('currentCompanyId')
      
      // Redirecionar apenas se não estiver já na página de login
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && !currentPath.startsWith('/login')) {
        // Usar window.location para garantir limpeza completa
        window.location.href = '/login?redirect=' + encodeURIComponent(currentPath)
      }
    }
    
    // Retornar erro para tratamento específico
    return Promise.reject(error)
  }
)

export { apiClient }

