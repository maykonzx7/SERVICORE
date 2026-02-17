<template>
  <Table
    :headers="headers"
    :items="orders"
    :loading="loading"
    @row-click="handleRowClick"
  >
    <template #cell-status="{ value }">
      <span :class="['status-badge', getStatusClass(value)]">
        {{ getStatusLabel(value) }}
      </span>
    </template>
    <template #cell-priority="{ value }">
      <span :class="['priority-badge', getPriorityClass(value)]">
        {{ getPriorityLabel(value) }}
      </span>
    </template>
    <template #cell-value="{ value }">
      {{ formatMoney(value) }}
    </template>
    <template #cell-createdAt="{ value }">
      {{ formatDate(value) }}
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table from '@/shared/components/ui/Table.vue'
import type { ServiceOrder } from '../types/service-order.types'
import { SERVICE_ORDER_STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/shared/constants/enums'
import { formatMoney, formatDate } from '@/shared/utils/formatters'

interface Props {
  orders: ServiceOrder[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  rowClick: [order: ServiceOrder]
}>()

const headers = [
  { key: 'id', label: 'ID', class: 'w-32' },
  { key: 'description', label: 'Descrição', class: 'flex-1' },
  { key: 'status', label: 'Status', class: 'w-32' },
  { key: 'priority', label: 'Prioridade', class: 'w-32' },
  { key: 'value', label: 'Valor', class: 'w-32', format: 'money' },
  { key: 'createdAt', label: 'Criado em', class: 'w-40', format: 'date' },
]

function handleRowClick(order: ServiceOrder) {
  emit('rowClick', order)
}

function getStatusLabel(status: string): string {
  const option = SERVICE_ORDER_STATUS_OPTIONS.find((opt) => opt.value === status)
  return option?.label || status
}

function getStatusClass(status: string): string {
  return `status-${status.toLowerCase().replace('_', '-')}`
}

function getPriorityLabel(priority: string): string {
  const option = PRIORITY_OPTIONS.find((opt) => opt.value === priority)
  return option?.label || priority
}

function getPriorityClass(priority: string): string {
  return `priority-${priority.toLowerCase()}`
}
</script>

<style scoped>
.status-badge,
.priority-badge {
  display: inline-block;
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
</style>


