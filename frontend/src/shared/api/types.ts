// Response padrão paginado
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Response padrão de erro
export interface ApiError {
  message: string
  code?: string
  errors?: Record<string, string[]>
}

// Response padrão de sucesso
export interface ApiResponse<T> {
  data: T
  message?: string
}

