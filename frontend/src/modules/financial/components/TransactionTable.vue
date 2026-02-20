<template>
  <Table
    :headers="headers"
    :items="transactions"
    :loading="loading"
    @row-click="handleRowClick"
  >
    <template #cell-type="{ value }">
      <span :class="['type-badge', getTypeClass(value)]">
        {{ getTypeLabel(value) }}
      </span>
    </template>
    <template #cell-status="{ value }">
      <span :class="['status-badge', getStatusClass(value)]">
        {{ getStatusLabel(value) }}
      </span>
    </template>
    <template #cell-amount="{ value, item }">
      <span :class="['amount', getTypeClass(item.type)]">
        {{ item.type === 'INCOME' ? '+' : '-' }}{{ formatMoney(value) }}
      </span>
    </template>
    <template #cell-serviceOrderId="{ value }">
      <a
        v-if="value"
        :href="`/service-orders/${value}`"
        class="service-order-link"
        @click.stop.prevent="goToServiceOrder(value)"
      >
        #{{ value.slice(0, 8) }}
      </a>
      <span v-else class="text-muted">-</span>
    </template>
    <template #cell-paymentMethod="{ value }">
      {{ value ? getPaymentMethodLabel(value) : '-' }}
    </template>
    <template #cell-createdAt="{ value }">
      {{ formatDate(value) }}
    </template>
  </Table>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Table from '@/shared/components/ui/Table.vue'
import type { Transaction } from '../types/financial.types'
import {
  TRANSACTION_TYPE_OPTIONS,
  TRANSACTION_STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from '@/shared/constants/enums'
import { formatMoney, formatDate } from '@/shared/utils/formatters'

const router = useRouter()

interface Props {
  transactions: Transaction[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  rowClick: [transaction: Transaction]
}>()

const headers = [
  { key: 'id', label: 'ID', class: 'w-32' },
  { key: 'description', label: 'Descrição', class: 'flex-1' },
  { key: 'type', label: 'Tipo', class: 'w-32' },
  { key: 'status', label: 'Status', class: 'w-32' },
  { key: 'amount', label: 'Valor', class: 'w-32', format: 'money' },
  { key: 'serviceOrderId', label: 'Ordem de Serviço', class: 'w-40' },
  { key: 'paymentMethod', label: 'Método', class: 'w-32' },
  { key: 'createdAt', label: 'Criado em', class: 'w-40', format: 'date' },
]

function handleRowClick(transaction: Transaction) {
  emit('rowClick', transaction)
}

function goToServiceOrder(id: string) {
  router.push(`/service-orders/${id}`)
}

function getTypeLabel(type: string): string {
  const option = TRANSACTION_TYPE_OPTIONS.find((opt) => opt.value === type)
  return option?.label || type
}

function getTypeClass(type: string): string {
  return type === 'INCOME' ? 'type-income' : 'type-expense'
}

function getStatusLabel(status: string): string {
  const option = TRANSACTION_STATUS_OPTIONS.find((opt) => opt.value === status)
  return option?.label || status
}

function getStatusClass(status: string): string {
  return `status-${status.toLowerCase()}`
}

function getPaymentMethodLabel(method: string): string {
  const option = PAYMENT_METHOD_OPTIONS.find((opt) => opt.value === method)
  return option?.label || method
}
</script>

<style scoped>
.type-badge,
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.type-income {
  background-color: #d1fae5;
  color: #065f46;
}

.type-expense {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-approved {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-rejected {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-processed {
  background-color: #d1fae5;
  color: #065f46;
}

.status-cancelled {
  background-color: #f3f4f6;
  color: #374151;
}

.amount {
  font-weight: 600;
}

.amount.type-income {
  color: #065f46;
}

.amount.type-expense {
  color: #991b1b;
}

.service-order-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.service-order-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.text-muted {
  color: #6b7280;
}
</style>

