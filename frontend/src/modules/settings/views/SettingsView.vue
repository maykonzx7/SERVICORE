<template>
  <div class="settings-view">
      <div class="settings-header">
        <h1 class="settings-title">Configurações</h1>
      </div>

      <div class="settings-content">
        <div class="settings-sidebar">
          <nav class="settings-nav">
            <router-link
              v-for="item in settingsItems"
              :key="item.name"
              :to="{ name: item.name }"
              class="settings-nav-item"
              :class="{ active: $route.name === item.name }"
            >
              <span class="settings-nav-icon">{{ item.icon }}</span>
              <span class="settings-nav-label">{{ item.label }}</span>
            </router-link>
          </nav>
        </div>

        <div class="settings-main">
          <router-view />
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/shared/stores/auth.store'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const authStore = useAuthStore()

interface SettingsItem {
  name: string
  label: string
  icon: string
  permission?: string
}

const settingsItems = computed<SettingsItem[]>(() => {
  const items: SettingsItem[] = [
    {
      name: ROUTE_NAMES.SETTINGS_GENERAL,
      label: 'Geral',
      icon: '⚙️',
    },
    {
      name: ROUTE_NAMES.SETTINGS_SECURITY,
      label: 'Segurança',
      icon: '🔒',
    },
    {
      name: ROUTE_NAMES.SETTINGS_NOTIFICATIONS,
      label: 'Notificações',
      icon: '🔔',
    },
    {
      name: ROUTE_NAMES.SETTINGS_INTEGRATIONS,
      label: 'Integrações',
      icon: '🔌',
      permission: 'settings:manage',
    },
    {
      name: ROUTE_NAMES.SETTINGS_AUDIT_LOGS,
      label: 'Logs de Auditoria',
      icon: '📋',
      permission: 'audit:view',
    },
  ]

  return items.filter((item) => {
    if (!item.permission) return true
    return authStore.hasPermission(item.permission)
  })
})
</script>

<style scoped>
.settings-view {
  max-width: 100rem;
  margin: 0 auto;
}

.settings-header {
  margin-bottom: 2rem;
}

.settings-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.settings-content {
  display: grid;
  grid-template-columns: 16rem 1fr;
  gap: 2rem;
}

.settings-sidebar {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  height: fit-content;
  position: sticky;
  top: 5rem;
}

.settings-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.settings-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  color: #374151;
  transition: all 0.2s;
}

.settings-nav-item:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.settings-nav-item.active {
  background-color: #eff6ff;
  color: #3b82f6;
  font-weight: 500;
}

.settings-nav-icon {
  font-size: 1.25rem;
}

.settings-nav-label {
  font-size: 0.875rem;
}

.settings-main {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
}
</style>

