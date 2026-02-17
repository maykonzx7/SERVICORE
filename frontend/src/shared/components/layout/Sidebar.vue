<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="sidebar-item"
        :class="{ 'sidebar-item-active': $route.name === item.name }"
      >
        <span class="sidebar-icon">{{ item.icon }}</span>
        <span class="sidebar-label">{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/shared/stores/auth.store'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const authStore = useAuthStore()

interface MenuItem {
  name: string
  label: string
  icon: string
  permission?: string
}

const menuItems = computed<MenuItem[]>(() => {
  const items: MenuItem[] = [
    {
      name: ROUTE_NAMES.DASHBOARD,
      label: 'Dashboard',
      icon: '📊',
    },
    {
      name: ROUTE_NAMES.SERVICE_ORDERS,
      label: 'Ordens de Serviço',
      icon: '📋',
      permission: 'service-order:view',
    },
    {
      name: ROUTE_NAMES.COMPANIES,
      label: 'Empresas',
      icon: '🏢',
    },
    {
      name: ROUTE_NAMES.FINANCIAL,
      label: 'Financeiro',
      icon: '💰',
      permission: 'financial:view',
    },
  ]

  // Filtrar itens por permissão
  return items.filter((item) => {
    if (!item.permission) return true
    return authStore.hasPermission(item.permission)
  })
})
</script>

<style scoped>
.sidebar {
  width: 16rem;
  background: white;
  border-right: 1px solid #e5e7eb;
  height: 100%;
  overflow-y: auto;
}

.sidebar-nav {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  color: #374151;
  transition: all 0.2s;
}

.sidebar-item:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.sidebar-item-active {
  background-color: #eff6ff;
  color: #3b82f6;
  font-weight: 500;
}

.sidebar-icon {
  font-size: 1.25rem;
}

.sidebar-label {
  font-size: 0.875rem;
}
</style>

