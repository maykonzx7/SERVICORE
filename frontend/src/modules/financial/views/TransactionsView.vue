<template>
  <div class="transactions-view">
      <div class="view-header">
        <h1 class="view-title">Transações Financeiras</h1>
        <Button @click="goToCreate">
          Nova Transação
        </Button>
      </div>

      <TransactionFilters @filter="handleFilter" />

      <div v-if="loading && !hasTransactions" class="view-loading">
        Carregando transações...
      </div>

      <div v-else-if="error" class="view-error">
        {{ error }}
        <Button variant="outline" size="sm" @click="handleRetry">
          Tentar Novamente
        </Button>
      </div>

      <div v-else-if="!hasTransactions" class="view-empty">
        <p>Nenhuma transação encontrada.</p>
        <Button @click="goToCreate">
          Criar Primeira Transação
        </Button>
      </div>

      <div v-else>
        <div class="view-options">
          <div class="view-toggle">
            <button
              :class="['toggle-btn', { active: viewMode === 'grid' }]"
              @click="viewMode = 'grid'"
            >
              Grid
            </button>
            <button
              :class="['toggle-btn', { active: viewMode === 'table' }]"
              @click="viewMode = 'table'"
            >
              Tabela
            </button>
          </div>
        </div>

        <div v-if="viewMode === 'grid'" class="transactions-grid">
          <TransactionCard
            v-for="transaction in transactions"
            :key="transaction.id"
            :transaction="transaction"
            @click="goToDetails(transaction.id)"
          />
        </div>

        <TransactionTable
          v-else
          :transactions="transactions"
          :loading="loading"
          @row-click="(transaction) => goToDetails(transaction.id)"
        />

        <div v-if="pagination.totalPages > 1" class="pagination">
          <Button
            variant="outline"
            size="sm"
            :disabled="pagination.page === 1"
            @click="changePage(pagination.page - 1)"
          >
            Anterior
          </Button>
          <span class="pagination-info">
            Página {{ pagination.page }} de {{ pagination.totalPages }}
            ({{ pagination.total }} total)
          </span>
          <Button
            variant="outline"
            size="sm"
            :disabled="pagination.page === pagination.totalPages"
            @click="changePage(pagination.page + 1)"
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCompanyStore } from '@/shared/stores/company.store'
import { useFinancial } from '../composables/useFinancial'
import Button from '@/shared/components/ui/Button.vue'
import TransactionCard from '../components/TransactionCard.vue'
import TransactionTable from '../components/TransactionTable.vue'
import TransactionFilters from '../components/TransactionFilters.vue'
import type { TransactionFilters as FiltersType } from '../types/financial.types'

const companyStore = useCompanyStore()
const {
  transactions,
  loading,
  error,
  pagination,
  hasTransactions,
  loadTransactions,
  searchTransactions,
  goToDetails,
  goToCreate,
} = useFinancial()

const viewMode = ref<'grid' | 'table'>('grid')
const currentFilters = ref<FiltersType>({})

const companyId = computed(() => companyStore.companyId)

onMounted(async () => {
  if (companyId.value) {
    await loadTransactions()
  }
})

watch(companyId, async (newCompanyId) => {
  if (newCompanyId) {
    await loadTransactions()
  }
})

async function handleFilter(filters: FiltersType) {
  currentFilters.value = filters
  if (companyId.value) {
    const hasFilters = Object.keys(filters).some(
      (key) => filters[key as keyof FiltersType] !== undefined && filters[key as keyof FiltersType] !== ''
    )
    if (hasFilters) {
      await searchTransactions(companyId.value, filters)
    } else {
      await loadTransactions()
    }
  }
}

async function changePage(page: number) {
  if (companyId.value) {
    const hasFilters = Object.keys(currentFilters.value).some(
      (key) => currentFilters.value[key as keyof FiltersType] !== undefined && currentFilters.value[key as keyof FiltersType] !== ''
    )
    if (hasFilters) {
      await searchTransactions(companyId.value, currentFilters.value, page)
    } else {
      await loadTransactions(page)
    }
  }
}

async function handleRetry() {
  await loadTransactions()
}
</script>

<style scoped>
.transactions-view {
  max-width: 80rem;
  margin: 0 auto;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.view-loading,
.view-empty {
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

.view-options {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.view-toggle {
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  overflow: hidden;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.toggle-btn:hover {
  background-color: #f3f4f6;
}

.toggle-btn.active {
  background-color: #3b82f6;
  color: white;
}

.transactions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>

