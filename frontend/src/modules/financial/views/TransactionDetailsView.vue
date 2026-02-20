<template>
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
          <Card>
            <div class="info-section">
              <h3 class="section-title">Informações Gerais</h3>
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
                <span class="info-value">
                  <router-link
                    :to="{ name: ROUTE_NAMES.SERVICE_ORDER_DETAILS, params: { id: transaction.serviceOrderId } }"
                    class="service-order-link"
                  >
                    #{{ transaction.serviceOrderId.slice(0, 8) }}
                  </router-link>
                  <span v-if="transaction.serviceOrder" class="service-order-description">
                    - {{ transaction.serviceOrder.description }}
                  </span>
                </span>
              </div>
              <div class="info-item" v-if="transaction.approvedBy">
                <span class="info-label">Aprovado por:</span>
                <span class="info-value">{{ transaction.approvedBy }}</span>
              </div>
              <div class="info-item" v-if="transaction.approvedAt">
                <span class="info-label">Aprovado em:</span>
                <span class="info-value">{{ formatDateTime(transaction.approvedAt) }}</span>
              </div>
              <div class="info-item" v-if="transaction.rejectedReason">
                <span class="info-label">Motivo da Rejeição:</span>
                <span class="info-value rejected-reason">{{ transaction.rejectedReason }}</span>
              </div>
              <div class="info-item" v-if="transaction.paidAt">
                <span class="info-label">Processado em:</span>
                <span class="info-value">{{ formatDateTime(transaction.paidAt) }}</span>
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
          </Card>

          <Card v-if="transaction.description" class="description-section">
            <div class="info-section">
              <h3 class="section-title">Descrição</h3>
              <p class="description-text">{{ transaction.description }}</p>
            </div>
          </Card>
        </div>

        <!-- Modal de edição -->
        <Modal v-model="showEditModal" title="Editar Transação" @close="showEditModal = false">
          <TransactionForm
            :transaction="transaction"
            @submit="handleUpdate"
            @cancel="showEditModal = false"
          />
        </Modal>

        <!-- Modal de rejeição -->
        <Modal v-model="showRejectModal" title="Rejeitar Transação" @close="showRejectModal = false">
          <div class="reject-form">
            <div class="form-group">
              <label class="form-label">Motivo da Rejeição <span class="required">*</span></label>
              <textarea
                v-model="rejectReason"
                class="form-textarea"
                rows="4"
                placeholder="Informe o motivo da rejeição..."
                required
              />
            </div>
            <div class="form-actions">
              <Button variant="outline" @click="showRejectModal = false">
                Cancelar
              </Button>
              <Button
                variant="danger"
                :disabled="!rejectReason.trim() || actionLoading"
                :loading="actionLoading"
                @click="confirmReject"
              >
                Rejeitar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFinancial } from '../composables/useFinancial'
import Button from '@/shared/components/ui/Button.vue'
import Card from '@/shared/components/ui/Card.vue'
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
const showRejectModal = ref(false)
const rejectReason = ref('')

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

const showRejectModal = ref(false)
const rejectReason = ref('')

async function handleReject() {
  if (!transaction.value) return
  showRejectModal.value = true
}

async function confirmReject() {
  if (!transaction.value || !rejectReason.value.trim()) return
  actionLoading.value = true
  try {
    await rejectTransaction(transaction.value.id, rejectReason.value)
    showRejectModal.value = false
    rejectReason.value = ''
  } finally {
    actionLoading.value = false
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-section {
  padding: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
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

.description-section {
  margin-top: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.description-text {
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

.service-order-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.service-order-link:hover {
  text-decoration: underline;
}

.service-order-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-left: 0.5rem;
}

.rejected-reason {
  color: #991b1b;
  font-style: italic;
}

.reject-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #ef4444;
}

.form-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
}

.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>

