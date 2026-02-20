import { apiClient } from '@/shared/api/client'
import type { Notification, NotificationFilters } from '../types/notification.types'

// Flag para rastrear se o endpoint existe (após primeiro 404, não tentar mais)
let unreadCountEndpointExists: boolean | null = null
let notificationsEndpointExists: boolean | null = null

// Função para verificar se o endpoint de unread count existe
export function hasUnreadCountEndpoint(): boolean {
  return unreadCountEndpointExists !== false
}

export const notificationsApi = {
  async getNotifications(filters?: NotificationFilters) {
    // Se já sabemos que o endpoint não existe, retornar vazio
    if (notificationsEndpointExists === false) {
      return { items: [], total: 0 }
    }

    try {
      const { data } = await apiClient.get<{ items: Notification[]; total: number }>('/notifications', {
        params: filters,
      })
      notificationsEndpointExists = true
      return data
    } catch (err: any) {
      if (err.response?.status === 404) {
        notificationsEndpointExists = false
        return { items: [], total: 0 }
      }
      throw err
    }
  },

  async markAsRead(notificationId: string) {
    try {
      const { data } = await apiClient.patch<Notification>(`/notifications/${notificationId}/read`)
      return data
    } catch (err: any) {
      // Se o endpoint não existir, apenas retornar sem erro (modo silencioso)
      if (err.response?.status === 404) {
        return null
      }
      throw err
    }
  },

  async markAllAsRead() {
    try {
      const { data } = await apiClient.patch<{ count: number }>('/notifications/read-all')
      return data
    } catch (err: any) {
      // Se o endpoint não existir, apenas retornar sem erro (modo silencioso)
      if (err.response?.status === 404) {
        return { count: 0 }
      }
      throw err
    }
  },

  async deleteNotification(notificationId: string) {
    try {
      await apiClient.delete(`/notifications/${notificationId}`)
    } catch (err: any) {
      // Se o endpoint não existir, apenas ignorar (modo silencioso)
      if (err.response?.status === 404) {
        return
      }
      throw err
    }
  },

  async getUnreadCount() {
    // Se já sabemos que o endpoint não existe, não fazer requisição
    if (unreadCountEndpointExists === false) {
      return { count: 0 }
    }

    try {
      const { data } = await apiClient.get<{ count: number }>('/notifications/unread-count')
      unreadCountEndpointExists = true
      return data
    } catch (err: any) {
      if (err.response?.status === 404) {
        unreadCountEndpointExists = false
        return { count: 0 }
      }
      throw err
    }
  },
}

