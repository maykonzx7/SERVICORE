<template>
  <div class="notification-widget">
    <button class="notification-btn" @click="toggleDropdown" ref="buttonRef">
      <span class="notification-icon">🔔</span>
      <Badge v-if="unreadCount > 0" :value="unreadCount > 99 ? '99+' : unreadCount" />
    </button>

    <div v-if="isOpen" v-click-outside="closeDropdown" class="notification-dropdown" ref="dropdownRef">
      <div class="notification-dropdown-header">
        <h3>Notificações</h3>
        <div class="notification-actions">
          <button
            v-if="unreadCount > 0"
            class="action-btn"
            @click="handleMarkAllAsRead"
          >
            Marcar todas como lidas
          </button>
          <router-link
            :to="{ name: ROUTE_NAMES.NOTIFICATIONS }"
            class="action-btn"
            @click="closeDropdown"
          >
            Ver todas
          </router-link>
        </div>
      </div>

      <div class="notification-list">
        <Loading v-if="loading" />
        <EmptyState
          v-else-if="recentNotifications.length === 0"
          message="Nenhuma notificação"
        />
        <div
          v-else
          v-for="notification in recentNotifications"
          :key="notification.id"
          :class="['notification-item', { unread: !notification.read }]"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-content">
            <div class="notification-type" :class="notification.type">
              {{ getTypeIcon(notification.type) }}
            </div>
            <div class="notification-text">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">
                {{ formatTime(notification.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '../composables/useNotifications'
import { useCompanyStore } from '@/shared/stores/company.store'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import { hasUnreadCountEndpoint } from '../api/notifications.api'
import Badge from '@/shared/components/ui/Badge.vue'
import Loading from '@/shared/components/ui/Loading.vue'
import EmptyState from '@/shared/components/ui/EmptyState.vue'
import { formatTime } from '@/shared/utils/date'
import type { Notification } from '../types/notification.types'

const router = useRouter()
const companyStore = useCompanyStore()
const {
  notifications,
  unreadCount,
  loading,
  loadNotifications,
  loadUnreadCount,
  markAsRead,
  markAllAsRead,
} = useNotifications()

const isOpen = ref(false)
const buttonRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)

const recentNotifications = computed(() => {
  return notifications.value.slice(0, 5)
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value && notifications.value.length === 0) {
    loadNotifications({ read: false })
  }
}

function closeDropdown() {
  isOpen.value = false
}

function handleNotificationClick(notification: Notification) {
  if (!notification.read) {
    markAsRead(notification.id)
  }
  if (notification.link) {
    router.push(notification.link)
    closeDropdown()
  }
}

async function handleMarkAllAsRead() {
  await markAllAsRead()
}

function getTypeIcon(type: Notification['type']): string {
  const icons: Record<Notification['type'], string> = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    'service-order': '📋',
    financial: '💰',
    user: '👤',
    system: '⚙️',
  }
  return icons[type] || 'ℹ️'
}

// Click outside directive
const vClickOutside = {
  mounted(el: HTMLElement & { clickOutsideEvent?: (event: MouseEvent) => void }, binding: { value: () => void }) {
    el.clickOutsideEvent = (event: MouseEvent) => {
      const button = buttonRef.value
      const dropdown = dropdownRef.value
      if (
        button &&
        dropdown &&
        !button.contains(event.target as Node) &&
        !dropdown.contains(event.target as Node)
      ) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElement & { clickOutsideEvent?: (event: MouseEvent) => void }) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  },
}

// Auto-refresh unread count
let refreshInterval: number | null = null

onMounted(async () => {
  // Só carregar se tiver empresa selecionada (notificações são por empresa)
  if (companyStore.hasCompany) {
    // Fazer primeira chamada para determinar se o endpoint existe
    await loadUnreadCount()
    
    // Só configurar refresh periódico se o endpoint existir
    if (hasUnreadCountEndpoint()) {
      refreshInterval = window.setInterval(() => {
        if (companyStore.hasCompany && hasUnreadCountEndpoint()) {
          loadUnreadCount()
        } else if (!hasUnreadCountEndpoint() && refreshInterval) {
          // Se o endpoint não existe, parar o intervalo
          clearInterval(refreshInterval)
          refreshInterval = null
        }
      }, 30000) // Refresh every 30 seconds
    }
  }
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.notification-widget {
  position: relative;
}

.notification-btn {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-btn:hover {
  background-color: #f3f4f6;
}

.notification-icon {
  font-size: 1.25rem;
}

.notification-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 24rem;
  max-height: 32rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.notification-dropdown-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-dropdown-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.notification-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  font-size: 0.75rem;
  color: #3b82f6;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
  text-decoration: none;
}

.action-btn:hover {
  background-color: #eff6ff;
}

.notification-list {
  overflow-y: auto;
  max-height: 24rem;
}

.notification-item {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f9fafb;
}

.notification-item.unread {
  background-color: #eff6ff;
}

.notification-item.unread:hover {
  background-color: #dbeafe;
}

.notification-content {
  display: flex;
  gap: 0.75rem;
}

.notification-type {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.notification-text {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.notification-message {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-time {
  color: #9ca3af;
  font-size: 0.75rem;
}
</style>

