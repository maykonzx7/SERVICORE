import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useCompanyStore } from '@/shared/stores/company.store'
import { ROUTE_NAMES } from '@/shared/constants/routes'

export function requireAuth(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    next({ 
      name: ROUTE_NAMES.LOGIN, 
      query: { redirect: to.fullPath } 
    })
  } else {
    next()
  }
}

export function requireCompany(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const companyStore = useCompanyStore()
  
  if (!companyStore.hasCompany) {
    next({ name: ROUTE_NAMES.COMPANY_SELECTION })
  } else {
    next()
  }
}

export function requireRole(role: string) {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore()
    
    if (!authStore.hasRole(role)) {
      // TODO: Criar página de Forbidden
      next({ name: ROUTE_NAMES.DASHBOARD })
    } else {
      next()
    }
  }
}

export function requirePermission(permission: string) {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore()
    
    if (!authStore.hasPermission(permission)) {
      // TODO: Criar página de Forbidden
      next({ name: ROUTE_NAMES.DASHBOARD })
    } else {
      next()
    }
  }
}

