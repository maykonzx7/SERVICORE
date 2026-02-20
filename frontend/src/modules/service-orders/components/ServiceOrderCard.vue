<template>
  <div class="service-order-card" @click="$emit('click', order)">
    <div class="card-header">
      <span class="card-id">#{{ order.id.slice(0, 8) }}</span>
      <span :class="['status-badge', getStatusClass(order.status)]">
        {{ getStatusLabel(order.status) }}
      </span>
    </div>
    <div class="card-body">
      <p class="card-description">{{ order.description }}</p>
      <div class="card-meta">
        <span :class="['priority-badge', getPriorityClass(order.priority)]">
          {{ getPriorityLabel(order.priority) }}
        </span>
        <span class="card-value">{{ formatMoney(order.value) }}</span>
      </div>
    </div>
    <div v-if="order.createdAt" class="card-footer">
      <small>{{ formatRelativeTime(order.createdAt) }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ServiceOrder } from '../types/service-order.types'
import { SERVICE_ORDER_STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/shared/constants/enums'
import { formatMoney } from '@/shared/utils/formatters'
import { formatRelativeTime } from '@/shared/utils/date'

interface Props {
  order: ServiceOrder
}

defineProps<Props>()

defineEmits<{
  click: [order: ServiceOrder]
}>()

function getStatusLabel(status: string | undefined): string {
  if (!status) return 'N/A'
  const option = SERVICE_ORDER_STATUS_OPTIONS.find((opt) => opt.value === status)
  return option?.label || status
}

function getStatusClass(status: string | undefined): string {
  if (!status) return 'status-unknown'
  return `status-${status.toLowerCase().replace('_', '-')}`
}

function getPriorityLabel(priority: string | undefined): string {
  if (!priority) return 'N/A'
  const option = PRIORITY_OPTIONS.find((opt) => opt.value === priority)
  return option?.label || priority
}

function getPriorityClass(priority: string | undefined): string {
  if (!priority) return 'priority-unknown'
  return `priority-${priority.toLowerCase()}`
}
</script>

<style scoped>
.service-order-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.service-order-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.card-id {
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-created {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-started {
  background-color: #fef3c7;
  color: #92400e;
}

.status-in-progress {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-completed {
  background-color: #d1fae5;
  color: #065f46;
}

.status-cancelled {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-paused {
  background-color: #f3f4f6;
  color: #374151;
}

.status-rejected {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-unknown {
  background-color: #f3f4f6;
  color: #6b7280;
}

.card-body {
  margin-bottom: 0.75rem;
}

.card-description {
  margin: 0 0 0.5rem 0;
  color: #374151;
  line-height: 1.5;
  font-size: 0.875rem;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.priority-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.priority-low {
  background-color: #d1fae5;
  color: #065f46;
}

.priority-medium {
  background-color: #fef3c7;
  color: #92400e;
}

.priority-high {
  background-color: #fee2e2;
  color: #991b1b;
}

.priority-critical {
  background-color: #f3e8ff;
  color: #6b21a8;
}

.priority-unknown {
  background-color: #f3f4f6;
  color: #6b7280;
}

.card-value {
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
}

.card-footer {
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
}

.card-footer small {
  color: #6b7280;
  font-size: 0.75rem;
}
</style>


