<template>
  <DashboardLayout>
    <div class="transaction-details-view">
      <div v-if="loading" class="view-loading">
        Carregando transação...
      </div>

      <div v-else-if="error" class="view-error">
        {{ error }}
        <Button variant="outline" size="sm" @click="loadTransaction">
          Tentar Novamente
        </Button>
      </div>

      <div v-else-if="transaction" class="view-content">
        <div class="details-header">
          <div>
            <h1 class="details-title">Transação #{{ transaction.id.slice(0, 8) }}</h1>
            <p class="details-subtitle">{{ transaction.description }}</p>
          </div>
          <TransactionActions
            :transaction="transaction"
            :loading="actionLoading"
            @approve="handleApprove"
            @reject="handleReject"
            @process="handleProcess"
            @cancel="handleCancel"
            @edit="handleEdit"
          />
        </div>

        <div class="details-info">
          <div class="info-section">
            <h3>Informações</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Tipo:</span>
                <span :class="['info-value', 'type-badge', getTypeClass(transaction.type)]">
                  {{ getTypeLabel(transaction.type) }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Status:</span>
                <span :class="['info-value', 'status-badge', getStatusClass(transaction.status)]">
                  {{ getStatusLabel(transaction.status) }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Valor:</span>
                <span :class="['info-value', 'amount', getTypeClass(transaction.type)]">
                  {{ transaction.type === 'INCOME' ? '+' : '-' }}{{ formatMoney(transaction.amount) }}
                </span>
              </div>
              <div class="info-item" v-if="transaction.paymentMethod">
                <span class="info-label">Método de Pagamento:</span>
                <span class="info-value">{{ getPaymentMethodLabel(transaction.paymentMethod) }}</span>
              </div>
              <div class="info-item" v-if="transaction.dueDate">
                <span class="info-label">Data de Vencimento:</span>
                <span class="info-value">{{ formatDate(transaction.dueDate) }}</span>
              </div>
              <div class="info-item" v-if="transaction.serviceOrderId">
                <span class="info-label">Ordem de Serviço:</span>
                <span class="info-value">{{ transaction.serviceOrderId }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Criado em:</span>
                <span class="info-value">{{ formatDateTime(transaction.createdAt) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Atualizado em:</span>
                <span class="info-value">{{ formatDateTime(transaction.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal de edição -->
        <Modal v-model="showEditModal" title="Editar Transação" @close="showEditModal = false">
          <TransactionForm
            :transaction="transaction"
            @submit="handleUpdate"
            @cancel="showEditModal = false"
          />
        </Modal>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFinancial } from '../composables/useFinancial'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Button from '@/shared/components/ui/Button.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import TransactionActions from '../components/TransactionActions.vue'
import TransactionForm from '../components/TransactionForm.vue'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import {
  TRANSACTION_TYPE_OPTIONS,
  TRANSACTION_STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from '@/shared/constants/enums'
import { formatMoney, formatDate, formatDateTime } from '@/shared/utils/formatters'

const route = useRoute()
const router = useRouter()
const {
  currentTransaction,
  loading,
  error,
  loadTransactionById,
  approveTransaction,
  rejectTransaction,
  processTransaction,
  cancelTransaction,
  updateTransaction,
} = useFinancial()

const transaction = computed(() => currentTransaction.value)
const actionLoading = ref(false)
const showEditModal = ref(false)

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    await loadTransactionById(id)
  }
})

async function loadTransaction() {
  const id = route.params.id as string
  if (id) {
    await loadTransactionById(id)
  }
}

async function handleApprove() {
  if (!transaction.value) return
  actionLoading.value = true
  try {
    await approveTransaction(transaction.value.id)
  } finally {
    actionLoading.value = false
  }
}

async function handleReject() {
  if (!transaction.value) return
  const reason = prompt('Motivo da rejeição:')
  if (reason) {
    actionLoading.value = true
    try {
      await rejectTransaction(transaction.value.id, reason)
    } finally {
      actionLoading.value = false
    }
  }
}

async function handleProcess() {
  if (!transaction.value) return
  actionLoading.value = true
  try {
    await processTransaction(transaction.value.id)
  } finally {
    actionLoading.value = false
  }
}

async function handleCancel() {
  if (!transaction.value) return
  if (confirm('Tem certeza que deseja cancelar esta transação?')) {
    actionLoading.value = true
    try {
      await cancelTransaction(transaction.value.id)
    } finally {
      actionLoading.value = false
    }
  }
}

function handleEdit() {
  showEditModal.value = true
}

async function handleUpdate() {
  showEditModal.value = false
  await loadTransaction()
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
.transaction-details-view {
  max-width: 80rem;
  margin: 0 auto;
}

.view-loading {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
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
}

.view-content {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.details-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.details-subtitle {
  color: #6b7280;
  margin: 0;
}

.details-info {
  margin-top: 2rem;
}

.info-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 1rem;
  color: #111827;
}

.type-badge,
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
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
  font-size: 1.125rem;
}

.amount.type-income {
  color: #065f46;
}

.amount.type-expense {
  color: #991b1b;
}
</style>

