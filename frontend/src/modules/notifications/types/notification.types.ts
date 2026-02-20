export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error' | 'service-order' | 'financial' | 'user' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
  link?: string
  metadata?: Record<string, unknown>
}

export interface NotificationFilters {
  type?: Notification['type']
  read?: boolean
  startDate?: string
  endDate?: string
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  inApp: boolean
  types: Record<string, {
    email: boolean
    push: boolean
    sms: boolean
    inApp: boolean
  }>
}

