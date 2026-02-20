<template>
  <Card>
    <div class="activity-widget">
      <div class="activity-header">
        <h3 class="activity-title">{{ title }}</h3>
        <router-link v-if="viewAllLink" :to="viewAllLink" class="activity-link">
          Ver todas
        </router-link>
      </div>
      <div class="activity-list">
        <Loading v-if="loading" />
        <EmptyState v-else-if="activities.length === 0" message="Nenhuma atividade recente" />
        <div v-else class="activity-items">
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="activity-item"
            @click="handleActivityClick(activity)"
          >
            <div class="activity-icon" :class="activity.type">
              {{ getTypeIcon(activity.type) }}
            </div>
            <div class="activity-content">
              <div class="activity-text">{{ activity.text }}</div>
              <div class="activity-time">{{ formatTime(activity.time) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/shared/components/ui/Card.vue'
import Loading from '@/shared/components/ui/Loading.vue'
import EmptyState from '@/shared/components/ui/EmptyState.vue'
import { formatRelativeTime } from '@/shared/utils/date'

interface Activity {
  id: string
  type: 'service-order' | 'financial' | 'user' | 'system'
  text: string
  time: string | Date
  link?: string
}

interface Props {
  title?: string
  activities: Activity[]
  loading?: boolean
  viewAllLink?: { name: string } | string
}

withDefaults(defineProps<Props>(), {
  title: 'Atividades Recentes',
  loading: false,
})

const router = useRouter()

function formatTime(time: string | Date): string {
  return formatRelativeTime(time)
}

function getTypeIcon(type: Activity['type']): string {
  const icons: Record<Activity['type'], string> = {
    'service-order': '📋',
    financial: '💰',
    user: '👤',
    system: '⚙️',
  }
  return icons[type] || '📌'
}

function handleActivityClick(activity: Activity) {
  if (activity.link) {
    if (typeof activity.link === 'string') {
      router.push(activity.link)
    } else {
      router.push(activity.link)
    }
  }
}
</script>

<style scoped>
.activity-widget {
  padding: 1.5rem;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.activity-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.activity-link {
  font-size: 0.875rem;
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s;
}

.activity-link:hover {
  color: #2563eb;
}

.activity-list {
  min-height: 8rem;
}

.activity-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.activity-item:hover {
  background-color: #f9fafb;
}

.activity-icon {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.activity-icon.service-order {
  background-color: #dbeafe;
}

.activity-icon.financial {
  background-color: #d1fae5;
}

.activity-icon.user {
  background-color: #e0e7ff;
}

.activity-icon.system {
  background-color: #f3f4f6;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-text {
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.75rem;
  color: #9ca3af;
}
</style>

