import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/modules/auth/api/auth.api'
import { getPermissionsFromRoles } from '@/shared/utils/permissions'
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
  const userPermissions = computed(() => {
    // Se o backend retornou permissões explícitas, usar elas
    if (user.value?.permissions && user.value.permissions.length > 0) {
      return user.value.permissions
    }
    // Caso contrário, mapear roles para permissões
    return getPermissionsFromRoles(userRoles.value)
  })
  const userName = computed(() => user.value?.name || user.value?.email || 'Usuário')

  // ========== ACTIONS ==========
  async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    loading.value = true
    error.value = null
    try {
      const response = await authApi.login(credentials)
      // O axios retorna response.data, e o backend retorna { token, user } diretamente
      // Se a API retornar { data: { token, user } }, usar response.data.data
      // Se retornar { token, user } diretamente, usar response.data
      const authData = (response.data as any)?.data || (response.data as AuthResponse)
      
      if (!authData || !authData.token || !authData.user) {
        console.error('Resposta inválida do servidor:', response.data)
        throw new Error('Resposta inválida do servidor')
      }
      
      console.log('Login bem-sucedido:', { token: authData.token, userId: authData.user.id })
      
      token.value = authData.token
      user.value = authData.user
      
      // Persistir token (JWT agora é usado para autenticação)
      localStorage.setItem('token', authData.token)
      
      return authData
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao fazer login'
      error.value = errorMessage
      console.error('Erro no login:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
    loading.value = true
    error.value = null
    try {
      // Registrar usuário (backend retorna apenas dados do usuário, sem token)
      const registerResponse = await authApi.register(credentials)
      const userData = registerResponse.data?.data || registerResponse.data
      
      if (!userData || !userData.email) {
        throw new Error('Resposta inválida do servidor ao registrar')
      }
      
      // Após registro bem-sucedido, fazer login automático
      try {
        const loginResponse = await authApi.login({
          email: credentials.email,
          password: credentials.password,
        })
        
        // O login retorna { token, user }
        const authData = loginResponse.data?.data || loginResponse.data
        
        if (!authData || !authData.token) {
          throw new Error('Erro ao fazer login automático após registro')
        }
        
        token.value = authData.token
        user.value = authData.user
        
        localStorage.setItem('token', authData.token)
        
        return authData
      } catch (loginErr: any) {
        // Se o login automático falhar, ainda consideramos o registro como sucesso
        // O usuário precisará fazer login manualmente
        console.warn('Registro bem-sucedido, mas login automático falhou:', loginErr)
        throw new Error('Conta criada com sucesso! Por favor, faça login.')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao registrar'
      error.value = errorMessage
      console.error('Erro no registro:', err)
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
    
    // Evitar carregar múltiplas vezes simultaneamente
    if (loading.value) return
    
    loading.value = true
    try {
      const response = await authApi.getCurrentUser()
      user.value = response.data
    } catch (err: any) {
      // Se falhar, limpar token inválido
      if (err.response?.status === 401) {
        await logout()
      } else {
        console.error('Erro ao carregar usuário:', err)
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
      // Carregar usuário do backend (com roles atualizados)
      loadCurrentUser()
    }
  }

  /**
   * Atualiza os dados do usuário do backend
   * Útil quando os roles foram alterados e o token ainda não foi renovado
   */
  async function refreshUser() {
    await loadCurrentUser()
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
    refreshUser,
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

