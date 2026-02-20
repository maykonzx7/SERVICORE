import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { requireAuth, requireCompany } from '@/shared/router/guards'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/shared/constants/routes'
import { useAuthStore } from '@/shared/stores/auth.store'

const routes: RouteRecordRaw[] = [
  // Auth Routes
  {
    path: ROUTE_PATHS.LOGIN,
    name: ROUTE_NAMES.LOGIN,
    component: () => import('@/modules/auth/views/LoginView.vue'),
    meta: { requiresAuth: false, layout: 'auth' },
  },
  {
    path: ROUTE_PATHS.REGISTER,
    name: ROUTE_NAMES.REGISTER,
    component: () => import('@/modules/auth/views/RegisterView.vue'),
    meta: { requiresAuth: false, layout: 'auth' },
  },
  {
    path: ROUTE_PATHS.PASSWORD_RESET,
    name: ROUTE_NAMES.PASSWORD_RESET,
    component: () => import('@/modules/auth/views/PasswordResetView.vue'),
    meta: { requiresAuth: false, layout: 'auth' },
  },
  {
    path: ROUTE_PATHS.PASSWORD_RESET_CONFIRM,
    name: ROUTE_NAMES.PASSWORD_RESET_CONFIRM,
    component: () => import('@/modules/auth/views/PasswordResetConfirmView.vue'),
    meta: { requiresAuth: false, layout: 'auth' },
  },
  // Company Setup (para novos usuários)
  {
    path: ROUTE_PATHS.COMPANY_SETUP,
    name: ROUTE_NAMES.COMPANY_SETUP,
    component: () => import('@/modules/organization/views/CompanySetupView.vue'),
    meta: { requiresAuth: true, requiresCompany: false, layout: 'dashboard' },
    beforeEnter: [requireAuth],
  },
  // Company Selection (para usuários com múltiplas empresas)
  {
    path: ROUTE_PATHS.COMPANY_SELECTION,
    name: ROUTE_NAMES.COMPANY_SELECTION,
    component: () => import('@/modules/organization/views/CompanySelectionView.vue'),
    meta: { requiresAuth: true, requiresCompany: false, layout: 'dashboard' },
    beforeEnter: [requireAuth],
  },
  // Dashboard Routes
  {
    path: '/',
    component: () => import('@/shared/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true, requiresCompany: true, layout: 'dashboard' },
    beforeEnter: [requireAuth, requireCompany],
    children: [
      {
        path: '',
        name: ROUTE_NAMES.DASHBOARD,
        component: () => import('@/modules/service-orders/views/HomeView.vue'),
      },
      // Service Orders
      {
        path: 'service-orders',
        name: ROUTE_NAMES.SERVICE_ORDERS,
        component: () =>
          import('@/modules/service-orders/views/ServiceOrdersView.vue'),
        meta: {
          title: 'Ordens de Serviço',
          requiresPermission: 'service-order:view',
        },
      },
      {
        path: 'service-orders/create',
        name: ROUTE_NAMES.SERVICE_ORDER_CREATE,
        component: () =>
          import('@/modules/service-orders/views/ServiceOrderCreateView.vue'),
        meta: {
          title: 'Criar Ordem de Serviço',
          requiresPermission: 'service-order:create',
        },
      },
      {
        path: 'service-orders/:id',
        name: ROUTE_NAMES.SERVICE_ORDER_DETAILS,
        component: () =>
          import('@/modules/service-orders/views/ServiceOrderDetailsView.vue'),
        meta: {
          title: 'Detalhes da Ordem de Serviço',
          requiresPermission: 'service-order:view',
        },
      },
      {
        path: 'service-orders/:id/edit',
        name: ROUTE_NAMES.SERVICE_ORDER_EDIT,
        component: () =>
          import('@/modules/service-orders/views/ServiceOrderEditView.vue'),
        meta: {
          title: 'Editar Ordem de Serviço',
          requiresPermission: 'service-order:update',
        },
      },
      // Organization
      {
        path: 'companies',
        name: ROUTE_NAMES.COMPANIES,
        component: () => import('@/modules/organization/views/CompaniesView.vue'),
        meta: {
          title: 'Empresas',
        },
      },
      {
        path: 'companies/:id',
        name: ROUTE_NAMES.COMPANY_DETAILS,
        component: () => import('@/modules/organization/views/CompanyDetailsView.vue'),
        meta: {
          title: 'Detalhes da Empresa',
        },
      },
      {
        path: 'companies/:id/settings',
        name: ROUTE_NAMES.COMPANY_SETTINGS,
        component: () => import('@/modules/organization/views/CompanySettingsView.vue'),
        meta: {
          title: 'Configurações da Empresa',
        },
      },
      // Financial
      {
        path: 'transactions',
        name: ROUTE_NAMES.TRANSACTIONS,
        component: () => import('@/modules/financial/views/TransactionsView.vue'),
        meta: {
          title: 'Transações Financeiras',
          requiresPermission: 'financial:view',
        },
      },
      {
        path: 'transactions/create',
        name: ROUTE_NAMES.TRANSACTION_CREATE,
        component: () => import('@/modules/financial/views/TransactionCreateView.vue'),
        meta: {
          title: 'Criar Transação',
          requiresPermission: 'financial:create',
        },
      },
      {
        path: 'transactions/:id',
        name: ROUTE_NAMES.TRANSACTION_DETAILS,
        component: () => import('@/modules/financial/views/TransactionDetailsView.vue'),
        meta: {
          title: 'Detalhes da Transação',
          requiresPermission: 'financial:view',
        },
      },
      {
        path: 'financial/dashboard',
        name: ROUTE_NAMES.FINANCIAL_DASHBOARD,
        component: () => import('@/modules/financial/views/FinancialDashboardView.vue'),
        meta: {
          title: 'Dashboard Financeiro',
          requiresPermission: 'financial:view',
        },
      },
      // Profile
      {
        path: 'profile',
        name: ROUTE_NAMES.PROFILE,
        component: () => import('@/modules/auth/views/ProfileView.vue'),
        meta: {
          title: 'Meu Perfil',
        },
      },
      // Users Management
      {
        path: 'users',
        name: ROUTE_NAMES.USERS,
        component: () => import('@/modules/users/views/UsersView.vue'),
        meta: {
          title: 'Usuários',
          requiresPermission: 'user:view',
        },
      },
      {
        path: 'users/create',
        name: ROUTE_NAMES.USER_CREATE,
        component: () => import('@/modules/users/views/UserCreateView.vue'),
        meta: {
          title: 'Criar Usuário',
          requiresPermission: 'user:create',
        },
      },
      {
        path: 'users/:id',
        name: ROUTE_NAMES.USER_DETAILS,
        component: () => import('@/modules/users/views/UserDetailsView.vue'),
        meta: {
          title: 'Detalhes do Usuário',
          requiresPermission: 'user:view',
        },
      },
      {
        path: 'users/:id/edit',
        name: ROUTE_NAMES.USER_EDIT,
        component: () => import('@/modules/users/views/UserEditView.vue'),
        meta: {
          title: 'Editar Usuário',
          requiresPermission: 'user:update',
        },
      },
      // Roles & Permissions
      {
        path: 'roles',
        name: ROUTE_NAMES.ROLES,
        component: () => import('@/modules/users/views/RolesView.vue'),
        meta: {
          title: 'Roles e Permissões',
          requiresPermission: 'role:view',
        },
      },
      {
        path: 'roles/:role',
        name: ROUTE_NAMES.ROLE_DETAILS,
        component: () => import('@/modules/users/views/RoleDetailsView.vue'),
        meta: {
          title: 'Detalhes do Role',
          requiresPermission: 'role:view',
        },
      },
      {
        path: 'permissions',
        name: ROUTE_NAMES.PERMISSIONS,
        component: () => import('@/modules/users/views/PermissionsView.vue'),
        meta: {
          title: 'Permissões',
          requiresPermission: 'permission:view',
        },
      },
      {
        path: 'roles/matrix',
        name: ROUTE_NAMES.ROLES_MATRIX,
        component: () => import('@/modules/users/views/RolesMatrixView.vue'),
        meta: {
          title: 'Matriz de Roles x Permissões',
          requiresPermission: 'role:view',
        },
      },
      // Notifications
      {
        path: 'notifications',
        name: ROUTE_NAMES.NOTIFICATIONS,
        component: () => import('@/modules/notifications/views/NotificationsView.vue'),
        meta: {
          title: 'Notificações',
        },
      },
      // Settings
      {
        path: 'settings',
        component: () => import('@/modules/settings/views/SettingsView.vue'),
        meta: {
          title: 'Configurações',
        },
        children: [
          {
            path: 'general',
            name: ROUTE_NAMES.SETTINGS_GENERAL,
            component: () => import('@/modules/settings/views/GeneralSettingsView.vue'),
            meta: {
              title: 'Configurações Gerais',
            },
          },
          {
            path: 'security',
            name: ROUTE_NAMES.SETTINGS_SECURITY,
            component: () => import('@/modules/settings/views/SecuritySettingsView.vue'),
            meta: {
              title: 'Configurações de Segurança',
            },
          },
          {
            path: 'notifications',
            name: ROUTE_NAMES.SETTINGS_NOTIFICATIONS,
            component: () => import('@/modules/settings/views/NotificationSettingsView.vue'),
            meta: {
              title: 'Configurações de Notificações',
            },
          },
          {
            path: 'integrations',
            name: ROUTE_NAMES.SETTINGS_INTEGRATIONS,
            component: () => import('@/modules/settings/views/IntegrationsSettingsView.vue'),
            meta: {
              title: 'Integrações',
              requiresPermission: 'settings:manage',
            },
          },
          {
            path: 'audit-logs',
            name: ROUTE_NAMES.SETTINGS_AUDIT_LOGS,
            component: () => import('@/modules/settings/views/AuditLogsView.vue'),
            meta: {
              title: 'Logs de Auditoria',
              requiresPermission: 'audit:view',
            },
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard global para verificar permissões
router.beforeEach((to, _from, next) => {
  // Verificar se a rota requer permissão
  const requiredPermission = to.meta.requiresPermission as string | undefined

  if (requiredPermission) {
    try {
      const authStore = useAuthStore()
      
      // Se o usuário não estiver carregado ainda, permitir acesso
      // (será verificado quando o usuário for carregado)
      if (!authStore.user) {
        next()
        return
      }
      
      // Verificar permissão apenas se o usuário estiver carregado
      if (!authStore.hasPermission(requiredPermission)) {
        // Usuário não tem permissão - redirecionar para dashboard
        console.warn(`Acesso negado: permissão '${requiredPermission}' necessária`)
        // Evitar loop: só redirecionar se não estiver indo para o dashboard
        if (to.name !== ROUTE_NAMES.DASHBOARD) {
          next({ name: ROUTE_NAMES.DASHBOARD })
          return
        }
      }
    } catch (error) {
      // Se houver erro, permitir acesso (será verificado depois)
      console.warn('Erro ao verificar permissão:', error)
    }
  }

  next()
})

export default router

