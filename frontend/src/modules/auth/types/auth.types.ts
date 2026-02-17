// Tipos específicos do módulo de autenticação

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  confirmPassword: string
  name?: string
}

export interface AuthResponse {
  token: string
  user: User
  refreshToken?: string
}

export interface User {
  id: string
  email: string
  name?: string
  roles: string[]
  permissions?: string[]
  createdAt: string
  updatedAt: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordReset {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

