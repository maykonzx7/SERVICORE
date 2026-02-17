import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useCompanyStore } from '@/shared/stores/company.store'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import type { LoginCredentials } from '../types/auth.types'

/**
 * Composable para facilitar uso da autenticação
 */
export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()
  const companyStore = useCompanyStore()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const loading = computed(() => authStore.loading)
  const error = computed(() => authStore.error)

  async function login(credentials: LoginCredentials) {
    try {
      await authStore.login(credentials)
      
      // Tentar carregar empresa do localStorage
      await companyStore.loadCurrentCompany()
      
      // Redirecionar baseado no estado
      const redirect = router.currentRoute.value.query.redirect as string
      
      // Aguardar um pouco para garantir que o estado foi atualizado
      await new Promise(resolve => setTimeout(resolve, 100))
      
      if (redirect) {
        // Se redirect for um path, usar path; se for um nome de rota, usar name
        if (redirect.startsWith('/')) {
          await router.push(redirect)
        } else {
          await router.push({ name: redirect })
        }
      } else if (companyStore.hasCompany) {
        await router.push({ name: ROUTE_NAMES.DASHBOARD })
      } else {
        await router.push({ name: ROUTE_NAMES.COMPANY_SELECTION })
      }
    } catch (err: any) {
      // Log do erro para debug
      console.error('Erro no login:', err)
      // Erro já está no store
      throw err
    }
  }

  async function logout() {
    await authStore.logout()
    router.push({ name: ROUTE_NAMES.LOGIN })
  }

  function requireAuth() {
    if (!isAuthenticated.value) {
      router.push({
        name: ROUTE_NAMES.LOGIN,
        query: { redirect: router.currentRoute.value.fullPath },
      })
    }
  }

  return {
    // State
    isAuthenticated,
    user,
    loading,
    error,
    // Actions
    login,
    logout,
    requireAuth,
    // Helpers
    hasRole: authStore.hasRole,
    hasPermission: authStore.hasPermission,
    clearError: authStore.clearError,
  }
}

