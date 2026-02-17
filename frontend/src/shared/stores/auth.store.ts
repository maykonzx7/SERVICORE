import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/modules/auth/api/auth.api'
import type {
  LoginCredentials,
  AuthResponse,
  User,
  RegisterCredentials,
  ChangePasswordRequest,
} from '@/modules/auth/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  // ========== STATE ==========
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ========== GETTERS ==========
  const isAuthenticated = computed(() => !!token.value)
  const userRoles = computed(() => user.value?.roles || [])
  const userPermissions = computed(() => user.value?.permissions || [])
  const userName = computed(() => user.value?.name || user.value?.email || 'Usuário')

  // ========== ACTIONS ==========
  async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    loading.value = true
    error.value = null
    try {
      const response = await authApi.login(credentials)
      const authData = response.data
      
      token.value = authData.token
      user.value = authData.user
      
      // Persistir token
      localStorage.setItem('token', authData.token)
      
      return authData
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao fazer login'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
    loading.value = true
    error.value = null
    try {
      const response = await authApi.register(credentials)
      const authData = response.data
      
      token.value = authData.token
      user.value = authData.user
      
      localStorage.setItem('token', authData.token)
      
      return authData
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao registrar'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await authApi.logout()
    } catch (err) {
      // Continuar mesmo se logout falhar
      console.error('Erro ao fazer logout:', err)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('currentCompanyId')
      loading.value = false
    }
  }

  async function loadCurrentUser() {
    if (!token.value) return
    
    loading.value = true
    try {
      const response = await authApi.getCurrentUser()
      user.value = response.data
    } catch (err: any) {
      // Se falhar, limpar token inválido
      if (err.response?.status === 401) {
        await logout()
      }
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(data: Partial<User>): Promise<User> {
    loading.value = true
    error.value = null
    try {
      const response = await authApi.updateProfile(data)
      user.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao atualizar perfil'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function changePassword(data: ChangePasswordRequest): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await authApi.changePassword(data)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao alterar senha'
      throw err
    } finally {
      loading.value = false
    }
  }

  function hasRole(role: string): boolean {
    return userRoles.value.includes(role)
  }

  function hasPermission(permission: string): boolean {
    return userPermissions.value.includes(permission)
  }

  function hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) => hasPermission(permission))
  }

  function hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((permission) => hasPermission(permission))
  }

  function clearError() {
    error.value = null
  }

  function loadFromStorage() {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      token.value = storedToken
      // Carregar usuário do backend
      loadCurrentUser()
    }
  }

  // ========== RETURN ==========
  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    userRoles,
    userPermissions,
    userName,
    // Actions
    login,
    register,
    logout,
    loadCurrentUser,
    updateProfile,
    changePassword,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    clearError,
    loadFromStorage,
  }
})

