<template>
  <DashboardLayout>
    <div class="financial-dashboard-view">
      <div class="view-header">
        <h1 class="view-title">Dashboard Financeiro</h1>
        <div class="view-actions">
          <Button variant="outline" @click="goToTransactions">
            Ver Todas as Transações
          </Button>
          <Button @click="goToCreate">
            Nova Transação
          </Button>
        </div>
      </div>

      <div v-if="loading" class="view-loading">
        Carregando dados financeiros...
      </div>

      <div v-else-if="error" class="view-error">
        {{ error }}
        <Button variant="outline" size="sm" @click="loadData">
          Tentar Novamente
        </Button>
      </div>

      <div v-else class="view-content">
        <!-- Resumo Financeiro -->
        <div v-if="summary" class="financial-summary">
          <div class="summary-card income">
            <div class="summary-icon">💰</div>
            <div class="summary-content">
              <div class="summary-label">Total de Receitas</div>
              <div class="summary-value positive">
                {{ formatMoney(summary.totalIncome) }}
              </div>
            </div>
          </div>
          <div class="summary-card expense">
            <div class="summary-icon">💸</div>
            <div class="summary-content">
              <div class="summary-label">Total de Despesas</div>
              <div class="summary-value negative">
                {{ formatMoney(summary.totalExpense) }}
              </div>
            </div>
          </div>
          <div class="summary-card balance">
            <div class="summary-icon">📊</div>
            <div class="summary-content">
              <div class="summary-label">Saldo Líquido</div>
              <div class="summary-value" :class="summary.netBalance >= 0 ? 'positive' : 'negative'">
                {{ formatMoney(summary.netBalance) }}
              </div>
            </div>
          </div>
          <div class="summary-card transactions">
            <div class="summary-icon">📝</div>
            <div class="summary-content">
              <div class="summary-label">Total de Transações</div>
              <div class="summary-value">
                {{ summary.transactionsCount }}
              </div>
            </div>
          </div>
        </div>

        <!-- Pendências -->
        <div v-if="summary" class="pending-section">
          <h2 class="section-title">Pendências</h2>
          <div class="pending-cards">
            <div class="pending-card">
              <div class="pending-label">Receitas Pendentes</div>
              <div class="pending-value positive">
                {{ formatMoney(summary.pendingIncome) }}
              </div>
            </div>
            <div class="pending-card">
              <div class="pending-label">Despesas Pendentes</div>
              <div class="pending-value negative">
                {{ formatMoney(summary.pendingExpense) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Período -->
        <div v-if="summary" class="period-section">
          <div class="period-info">
            <span class="period-label">Período:</span>
            <span class="period-value">
              {{ formatDate(summary.period.startDate) }} até {{ formatDate(summary.period.endDate) }}
            </span>
          </div>
        </div>

        <!-- Transações Recentes -->
        <div v-if="recentTransactions.length > 0" class="recent-section">
          <h2 class="section-title">Transações Recentes</h2>
          <div class="transactions-list">
            <TransactionCard
              v-for="transaction in recentTransactions"
              :key="transaction.id"
              :transaction="transaction"
              @click="goToDetails(transaction.id)"
            />
          </div>
        </div>

        <div v-else class="empty-state">
          <p>Nenhuma transação encontrada.</p>
          <Button @click="goToCreate">
            Criar Primeira Transação
          </Button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '@/shared/stores/company.store'
import { useFinancial } from '../composables/useFinancial'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Button from '@/shared/components/ui/Button.vue'
import TransactionCard from '../components/TransactionCard.vue'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import { formatMoney, formatDate } from '@/shared/utils/formatters'

const companyStore = useCompanyStore()
const {
  transactions,
  summary,
  loading,
  error,
  loadSummary,
  loadTransactions,
  goToDetails,
  goToCreate,
} = useFinancial()

const recentTransactions = computed(() => {
  return transactions.value.slice(0, 6)
})

onMounted(async () => {
  await loadData()
})

async function loadData() {
  if (!companyStore.companyId) return

  const endDate = new Date().toISOString()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 1)
  
  await Promise.all([
    loadSummary(companyStore.companyId, startDate.toISOString(), endDate),
    loadTransactions(1, 10),
  ])
}

import { useRouter } from 'vue-router'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const router = useRouter()

function goToTransactions() {
  router.push({ name: ROUTE_NAMES.TRANSACTIONS })
}
</script>

<style scoped>
.financial-dashboard-view {
  max-width: 80rem;
  margin: 0 auto;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.view-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.view-actions {
  display: flex;
  gap: 0.5rem;
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
  margin-bottom: 1.5rem;
}

.view-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.financial-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.summary-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.summary-icon {
  font-size: 2rem;
}

.summary-content {
  flex: 1;
}

.summary-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.summary-value.positive {
  color: #065f46;
}

.summary-value.negative {
  color: #991b1b;
}

.pending-section,
.recent-section {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.pending-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.pending-card {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.pending-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.pending-value {
  font-size: 1.25rem;
  font-weight: 600;
}

.pending-value.positive {
  color: #065f46;
}

.pending-value.negative {
  color: #991b1b;
}

.period-section {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;
}

.period-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.period-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.period-value {
  font-size: 0.875rem;
  color: #111827;
}

.transactions-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}
</style>

