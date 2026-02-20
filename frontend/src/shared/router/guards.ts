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
  
  // Se já tem empresa selecionada, permitir acesso
  if (companyStore.hasCompany) {
    next()
    return
  }
  
  // Se não tem empresa, tentar carregar do localStorage
  const storedCompanyId = localStorage.getItem('currentCompanyId')
  if (storedCompanyId) {
    // Tentar carregar a empresa do localStorage
    companyStore.loadCurrentCompany().then(() => {
      if (companyStore.hasCompany) {
        next()
      } else {
        // Empresa não encontrada, tentar carregar lista
        handleCompanyLoad(next, companyStore)
      }
    }).catch(() => {
      // Erro ao carregar empresa, tentar carregar lista
      handleCompanyLoad(next, companyStore)
    })
  } else {
    // Não há empresa selecionada, tentar carregar lista
    handleCompanyLoad(next, companyStore)
  }
}

function handleCompanyLoad(
  next: NavigationGuardNext,
  companyStore: ReturnType<typeof useCompanyStore>
) {
  companyStore.loadCompanies().then(() => {
    if (companyStore.hasCompany) {
      // Empresa foi selecionada automaticamente (apenas uma disponível)
      next()
    } else if (companyStore.companies.length === 0) {
      // Usuário não tem empresa - permitir acesso mas mostrar aviso
      // (empresa deveria ter sido criada no registro, mas pode ter falhado)
      // Redirecionar para seleção que permite criar empresa
      next({ name: ROUTE_NAMES.COMPANY_SELECTION })
    } else if (companyStore.companies.length === 1) {
      // Usuário tem apenas uma empresa, selecionar automaticamente
      companyStore.setCurrentCompany(companyStore.companies[0])
      next()
    } else {
      // Múltiplas empresas, redirecionar para seleção
      next({ name: ROUTE_NAMES.COMPANY_SELECTION })
    }
  }).catch(() => {
    // Erro ao carregar empresas, redirecionar para seleção
    next({ name: ROUTE_NAMES.COMPANY_SELECTION })
  })
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

