<template>
  <div class="notifications-view">
      <div class="view-header">
        <h1 class="view-title">Notificações</h1>
        <div class="view-actions">
          <Button
            v-if="unreadCount > 0"
            variant="outline"
            @click="handleMarkAllAsRead"
          >
            Marcar todas como lidas
          </Button>
        </div>
      </div>

      <div class="view-filters">
        <div class="filter-group">
          <label>Tipo:</label>
          <Select
            v-model="filters.type"
            :options="typeOptions"
            placeholder="Todos os tipos"
            @update:model-value="handleFilter"
          />
        </div>
        <div class="filter-group">
          <label>Status:</label>
          <Select
            v-model="filters.read"
            :options="readOptions"
            placeholder="Todas"
            @update:model-value="handleFilter"
          />
        </div>
      </div>

      <div v-if="loading && notifications.length === 0" class="view-loading">
        <Loading />
      </div>

      <div v-else-if="error" class="view-error">
        <p>{{ error }}</p>
        <Button variant="outline" size="sm" @click="loadNotifications">
          Tentar Novamente
        </Button>
      </div>

      <div v-else-if="notifications.length === 0" class="view-empty">
        <EmptyState message="Nenhuma notificação encontrada" />
      </div>

      <div v-else class="notifications-list">
        <div
          v-for="notification in groupedNotifications"
          :key="notification.date"
          class="notification-group"
        >
          <div class="group-header">{{ notification.date }}</div>
          <div class="group-items">
            <Card
              v-for="item in notification.items"
              :key="item.id"
              :class="['notification-card', { unread: !item.read }]"
              @click="handleNotificationClick(item)"
            >
              <div class="notification-card-content">
                <div class="notification-type" :class="item.type">
                  {{ getTypeIcon(item.type) }}
                </div>
                <div class="notification-info">
                  <div class="notification-title">{{ item.title }}</div>
                  <div class="notification-message">{{ item.message }}</div>
                  <div class="notification-time">
                    {{ formatTime(item.createdAt) }}
                  </div>
                </div>
                <div class="notification-actions">
                  <button
                    v-if="!item.read"
                    class="action-btn"
                    @click.stop="handleMarkAsRead(item.id)"
                    title="Marcar como lida"
                  >
                    ✓
                  </button>
                  <button
                    class="action-btn delete"
                    @click.stop="handleDelete(item.id)"
                    title="Deletar"
                  >
                    ×
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '../composables/useNotifications'
import Button from '@/shared/components/ui/Button.vue'
import Card from '@/shared/components/ui/Card.vue'
import Select from '@/shared/components/ui/Select.vue'
import Loading from '@/shared/components/ui/Loading.vue'
import EmptyState from '@/shared/components/ui/EmptyState.vue'
import { formatTime, formatDate } from '@/shared/utils/date'
import type { Notification, NotificationFilters } from '../types/notification.types'

const router = useRouter()
const {
  notifications,
  unreadCount,
  loading,
  error,
  loadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = useNotifications()

const filters = ref<NotificationFilters>({})

const typeOptions = [
  { value: undefined, label: 'Todos os tipos' },
  { value: 'info', label: 'Informação' },
  { value: 'success', label: 'Sucesso' },
  { value: 'warning', label: 'Aviso' },
  { value: 'error', label: 'Erro' },
  { value: 'service-order', label: 'Ordem de Serviço' },
  { value: 'financial', label: 'Financeiro' },
  { value: 'user', label: 'Usuário' },
  { value: 'system', label: 'Sistema' },
]

const readOptions = [
  { value: undefined, label: 'Todas' },
  { value: false, label: 'Não lidas' },
  { value: true, label: 'Lidas' },
]

const groupedNotifications = computed(() => {
  const groups: Record<string, Notification[]> = {}
  
  notifications.value.forEach((notification) => {
    const date = formatDate(notification.createdAt)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(notification)
  })

  return Object.entries(groups)
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .map(([date, items]) => ({
      date,
      items: items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    }))
})

onMounted(() => {
  loadNotifications()
})

function handleFilter() {
  loadNotifications(filters.value)
}

function handleNotificationClick(notification: Notification) {
  if (!notification.read) {
    markAsRead(notification.id)
  }
  if (notification.link) {
    router.push(notification.link)
  }
}

async function handleMarkAsRead(id: string) {
  await markAsRead(id)
}

async function handleMarkAllAsRead() {
  await markAllAsRead()
  loadNotifications(filters.value)
}

async function handleDelete(id: string) {
  await deleteNotification(id)
  loadNotifications(filters.value)
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
</script>

<style scoped>
.notifications-view {
  max-width: 80rem;
  margin: 0 auto;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.view-actions {
  display: flex;
  gap: 0.75rem;
}

.view-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.view-loading,
.view-empty {
  text-align: center;
  padding: 3rem;
}

.view-error {
  padding: 1rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #991b1b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.notification-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.group-header {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.group-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notification-card {
  cursor: pointer;
  transition: all 0.2s;
}

.notification-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.notification-card.unread {
  border-left: 4px solid #3b82f6;
  background-color: #eff6ff;
}

.notification-card-content {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.notification-type {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-size: 1.25rem;
}

.notification-info {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: #111827;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.notification-message {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.notification-time {
  color: #9ca3af;
  font-size: 0.75rem;
}

.notification-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #f3f4f6;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1.25rem;
  color: #6b7280;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #e5e7eb;
  color: #111827;
}

.action-btn.delete:hover {
  background: #fee2e2;
  color: #991b1b;
}
</style>

