// Tipos de domínio compartilhados (alinhados com backend)

// User (Identity & Access)
export interface User {
  id: string
  email: string
  roles: string[]
  permissions?: string[]
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Company (Organization)
export interface Company {
  id: string
  name: string
  cnpj?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

// Enums
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ServiceOrderStatus {
  CREATED = 'CREATED',
  STARTED = 'STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

