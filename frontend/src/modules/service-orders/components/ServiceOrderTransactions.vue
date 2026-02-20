<template>
  <Card>
    <div class="transactions-section">
      <div class="section-header">
        <h3 class="section-title">Transações Financeiras</h3>
        <Button
          variant="primary"
          size="sm"
          @click="showCreateModal = true"
        >
          <span class="button-icon">+</span>
          Nova Transação
        </Button>
      </div>

      <div v-if="loading" class="loading-state">
        <Loading message="Carregando transações..." />
      </div>

      <div v-else-if="error" class="error-state">
        <p class="error-message">{{ error }}</p>
        <Button variant="outline" size="sm" @click="loadTransactions">
          Tentar Novamente
        </Button>
      </div>

      <div v-else-if="transactions.length === 0" class="empty-state">
        <p class="empty-message">Nenhuma transação associada a esta ordem de serviço.</p>
        <Button variant="outline" size="sm" @click="showCreateModal = true">
          Criar Primeira Transação
        </Button>
      </div>

      <div v-else class="transactions-list">
        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          class="transaction-item"
        >
          <div class="transaction-info">
            <div class="transaction-header">
              <span :class="['transaction-type', `type-${transaction.type.toLowerCase()}`]">
                {{ transaction.type === 'INCOME' ? 'Receita' : 'Despesa' }}
              </span>
              <span :class="['transaction-status', `status-${transaction.status.toLowerCase()}`]">
                {{ getStatusLabel(transaction.status) }}
              </span>
            </div>
            <p class="transaction-description">{{ transaction.description }}</p>
            <div class="transaction-meta">
              <span class="transaction-amount" :class="transaction.type.toLowerCase()">
                {{ transaction.type === 'INCOME' ? '+' : '-' }}{{ formatMoney(transaction.amount) }}
              </span>
              <span class="transaction-date">{{ formatDate(transaction.date) }}</span>
            </div>
          </div>
          <div class="transaction-actions">
            <Button
              variant="ghost"
              size="sm"
              @click="goToTransaction(transaction.id)"
            >
              Ver Detalhes
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para criar transação -->
    <Modal
      v-model="showCreateModal"
      title="Nova Transação"
      @close="showCreateModal = false"
    >
      <div v-if="error" class="modal-error">
        <p>{{ error }}</p>
      </div>
      <TransactionForm
        :service-order-id="serviceOrderId"
        :initial-amount="initialAmount"
        @submit="handleCreateTransaction"
        @cancel="showCreateModal = false"
      />
    </Modal>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '@/shared/stores/company.store'
import { financialApi } from '@/shared/api/financial.api'
import { serviceOrderApi } from '@/shared/api/service-order.api'
import type { Transaction } from '@/modules/financial/types/financial.types'
import type { CreateTransactionDto } from '@/modules/financial/types/financial.types'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Loading from '@/shared/components/ui/Loading.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import TransactionForm from '@/modules/financial/components/TransactionForm.vue'
import { formatMoney } from '@/shared/utils/money'
import { formatDate } from '@/shared/utils/date'
import { TRANSACTION_STATUS_OPTIONS } from '@/shared/constants/enums'

interface Props {
  serviceOrderId: string
  initialAmount?: number
}

const props = defineProps<Props>()
const router = useRouter()
const companyStore = useCompanyStore()

const transactions = ref<Transaction[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const showCreateModal = ref(false)

const companyId = computed(() => companyStore.currentCompany?.id)

function getStatusLabel(status: string): string {
  const option = TRANSACTION_STATUS_OPTIONS.find(opt => opt.value === status)
  return option?.label || status
}

async function loadTransactions() {
  if (!companyId.value) return

  loading.value = true
  error.value = null

  try {
    // Buscar transações por ordem de serviço
    const response = await financialApi.search(
      companyId.value,
      { serviceOrderId: props.serviceOrderId },
      1,
      100
    )
    transactions.value = response.data.data
  } catch (err: any) {
    // Se o endpoint não existir (404), retornar lista vazia
    if (err.response?.status === 404) {
      transactions.value = []
      return
    }
    error.value = err.response?.data?.message || 'Erro ao carregar transações'
    console.error('Erro ao carregar transações:', err)
  } finally {
    loading.value = false
  }
}

async function handleCreateTransaction(data: CreateTransactionDto) {
  if (!companyId.value) return

  error.value = null // Limpar erro anterior
  try {
    await financialApi.create({
      ...data,
      companyId: companyId.value,
      serviceOrderId: props.serviceOrderId,
    })
    showCreateModal.value = false
    error.value = null
    await loadTransactions()
  } catch (err: any) {
    // Se o endpoint não existir, mostrar mensagem amigável
    if (err.isEndpointNotFound || err.response?.status === 404) {
      error.value = 'O módulo financeiro ainda não está disponível no backend. Por favor, aguarde a implementação do endpoint de transações.'
    } else {
      error.value = err.response?.data?.message || err.message || 'Erro ao criar transação'
    }
    console.error('Erro ao criar transação:', err)
    // Não fechar o modal se houver erro, para o usuário ver a mensagem
  }
}

function goToTransaction(id: string) {
  router.push(`/financial/transactions/${id}`)
}

onMounted(() => {
  if (companyId.value) {
    loadTransactions()
  }
})
</script>

<style scoped>
.transactions-section {
  padding: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.button-icon {
  margin-right: 0.5rem;
}

.loading-state,
.error-state,
.empty-state {
  padding: 2rem;
  text-align: center;
}

.error-message {
  color: var(--color-error);
  margin-bottom: 1rem;
}

.empty-message {
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background-secondary);
  transition: all 0.2s;
}

.transaction-item:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.transaction-info {
  flex: 1;
}

.transaction-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
}

.transaction-type {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.type-income {
  background: var(--color-success-light);
  color: var(--color-success);
}

.type-expense {
  background: var(--color-error-light);
  color: var(--color-error);
}

.transaction-status {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-pending {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.status-approved {
  background: var(--color-success-light);
  color: var(--color-success);
}

.status-rejected {
  background: var(--color-error-light);
  color: var(--color-error);
}

.status-processed {
  background: var(--color-info-light);
  color: var(--color-info);
}

.transaction-description {
  color: var(--color-text-primary);
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.transaction-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 0.5rem;
}

.transaction-amount {
  font-size: 1.1rem;
  font-weight: 600;
}

.transaction-amount.income {
  color: var(--color-success);
}

.transaction-amount.expense {
  color: var(--color-error);
}

.transaction-date {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.transaction-actions {
  display: flex;
  gap: 0.5rem;
}

.modal-error {
  padding: 1rem;
  margin-bottom: 1rem;
  background: #fee2e2;
  border: 1px solid #ef4444;
  border-radius: 8px;
  color: #991b1b;
}

.modal-error p {
  margin: 0;
  font-size: 0.875rem;
}
</style>

