import { ref, computed, onMounted } from 'vue'
import { notificationsApi } from '../api/notifications.api'
import type { Notification, NotificationFilters } from '../types/notification.types'

export function useNotifications() {
  const notifications = ref<Notification[]>([])
  const unreadCount = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const unreadNotifications = computed(() =>
    notifications.value.filter((n) => !n.read)
  )

  const readNotifications = computed(() =>
    notifications.value.filter((n) => n.read)
  )

  async function loadNotifications(filters?: NotificationFilters) {
    loading.value = true
    error.value = null
    try {
      const response = await notificationsApi.getNotifications(filters)
      notifications.value = response.items || []
      // Atualizar contador localmente após carregar notificações
      unreadCount.value = notifications.value.filter((n) => !n.read).length
    } catch (err: any) {
      // Se o endpoint não existir (404), apenas inicializar vazio
      if (err.response?.status === 404) {
        notifications.value = []
        unreadCount.value = 0
      } else {
        error.value = err instanceof Error ? err.message : 'Erro ao carregar notificações'
      }
    } finally {
      loading.value = false
    }
  }

  async function loadUnreadCount() {
    try {
      const response = await notificationsApi.getUnreadCount()
      unreadCount.value = response.count
    } catch (err: any) {
      // Se o endpoint não existir (404), calcular localmente
      // A API já trata 404 e retorna { count: 0 }, então isso só acontece em outros erros
      if (notifications.value.length > 0) {
        unreadCount.value = notifications.value.filter((n) => !n.read).length
      } else {
        unreadCount.value = 0
      }
    }
  }

  async function markAsRead(notificationId: string) {
    try {
      await notificationsApi.markAsRead(notificationId)
      const notification = notifications.value.find((n) => n.id === notificationId)
      if (notification) {
        notification.read = true
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao marcar como lida'
    }
  }

  async function markAllAsRead() {
    try {
      await notificationsApi.markAllAsRead()
      notifications.value.forEach((n) => {
        n.read = true
      })
      unreadCount.value = 0
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao marcar todas como lidas'
    }
  }

  async function deleteNotification(notificationId: string) {
    try {
      await notificationsApi.deleteNotification(notificationId)
      const index = notifications.value.findIndex((n) => n.id === notificationId)
      if (index !== -1) {
        const notification = notifications.value[index]
        notifications.value.splice(index, 1)
        if (!notification.read) {
          unreadCount.value = Math.max(0, unreadCount.value - 1)
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao deletar notificação'
    }
  }

  onMounted(() => {
    loadUnreadCount()
  })

  return {
    notifications,
    unreadCount,
    unreadNotifications,
    readNotifications,
    loading,
    error,
    loadNotifications,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }
}

