<template>
  <div class="transaction-card" @click="$emit('click', transaction)">
    <div class="card-header">
      <span class="card-id">#{{ transaction.id.slice(0, 8) }}</span>
      <span :class="['type-badge', getTypeClass(transaction.type)]">
        {{ getTypeLabel(transaction.type) }}
      </span>
    </div>
    <div class="card-body">
      <p class="card-description">{{ transaction.description }}</p>
      <div class="card-meta">
        <span :class="['status-badge', getStatusClass(transaction.status)]">
          {{ getStatusLabel(transaction.status) }}
        </span>
        <span :class="['card-amount', getTypeClass(transaction.type)]">
          {{ transaction.type === 'INCOME' ? '+' : '-' }}{{ formatMoney(transaction.amount) }}
        </span>
      </div>
    </div>
    <div class="card-footer">
      <small>{{ formatRelativeTime(transaction.createdAt) }}</small>
      <small v-if="transaction.paymentMethod" class="payment-method">
        {{ getPaymentMethodLabel(transaction.paymentMethod) }}
      </small>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from '../types/financial.types'
import {
  TRANSACTION_TYPE_OPTIONS,
  TRANSACTION_STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from '@/shared/constants/enums'
import { formatMoney } from '@/shared/utils/formatters'
import { formatRelativeTime } from '@/shared/utils/date'

interface Props {
  transaction: Transaction
}

defineProps<Props>()

defineEmits<{
  click: [transaction: Transaction]
}>()

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
.transaction-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.transaction-card:hover {
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

.type-badge {
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

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
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

.card-amount {
  font-weight: 600;
  font-size: 0.875rem;
}

.card-amount.type-income {
  color: #065f46;
}

.card-amount.type-expense {
  color: #991b1b;
}

.card-footer {
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-footer small {
  color: #6b7280;
  font-size: 0.75rem;
}

.payment-method {
  font-weight: 500;
}
</style>

