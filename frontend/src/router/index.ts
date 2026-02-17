import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { requireAuth, requireCompany } from '@/shared/router/guards'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/shared/constants/routes'

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
  // Company Selection
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
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

