import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import type { LoginCredentials } from '../types/auth.types'

/**
 * Composable para facilitar uso da autenticação
 */
export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const loading = computed(() => authStore.loading)
  const error = computed(() => authStore.error)

  async function login(credentials: LoginCredentials) {
    try {
      await authStore.login(credentials)
      const redirect = router.currentRoute.value.query.redirect as string
      router.push({ name: redirect || ROUTE_NAMES.DASHBOARD })
    } catch (err) {
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

