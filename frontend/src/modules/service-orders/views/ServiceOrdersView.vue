<template>
  <DashboardLayout>
    <div class="service-orders-view">
      <div class="view-header">
        <h1 class="view-title">Ordens de Serviço</h1>
        <Button @click="goToCreate">
          Nova Ordem
        </Button>
      </div>

      <ServiceOrderFilters @filter="handleFilter" />

      <div v-if="loading && !hasOrders" class="view-loading">
        Carregando ordens de serviço...
      </div>

      <div v-else-if="error" class="view-error">
        {{ error }}
        <Button variant="outline" size="sm" @click="loadOrders">
          Tentar Novamente
        </Button>
      </div>

      <div v-else-if="!hasOrders" class="view-empty">
        <p>Nenhuma ordem de serviço encontrada.</p>
        <Button @click="goToCreate">
          Criar Primeira Ordem
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

        <div v-if="viewMode === 'grid'" class="orders-grid">
          <ServiceOrderCard
            v-for="order in orders"
            :key="order.id"
            :order="order"
            @click="goToDetails(order.id)"
          />
        </div>

        <ServiceOrderTable
          v-else
          :orders="orders"
          :loading="loading"
          @row-click="(order) => goToDetails(order.id)"
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
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCompanyStore } from '@/shared/stores/company.store'
import { useServiceOrder } from '../composables/useServiceOrder'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Button from '@/shared/components/ui/Button.vue'
import ServiceOrderCard from '../components/ServiceOrderCard.vue'
import ServiceOrderTable from '../components/ServiceOrderTable.vue'
import ServiceOrderFilters from '../components/ServiceOrderFilters.vue'
import type { ServiceOrderFilters as FiltersType } from '../types/service-order.types'

const companyStore = useCompanyStore()
const {
  orders,
  loading,
  error,
  pagination,
  hasOrders,
  loadOrders,
  searchOrders,
  goToDetails,
  goToCreate,
} = useServiceOrder()

const viewMode = ref<'grid' | 'table'>('grid')
const currentFilters = ref<FiltersType>({})

const companyId = computed(() => companyStore.companyId)

onMounted(async () => {
  if (companyId.value) {
    await loadOrders()
  }
})

watch(companyId, async (newCompanyId) => {
  if (newCompanyId) {
    await loadOrders()
  }
})

async function handleFilter(filters: FiltersType) {
  currentFilters.value = filters
  if (companyId.value) {
    const hasFilters = Object.keys(filters).some(
      (key) => filters[key as keyof FiltersType] !== undefined && filters[key as keyof FiltersType] !== ''
    )
    if (hasFilters) {
      await searchOrders(companyId.value, filters)
    } else {
      await loadOrders()
    }
  }
}

async function changePage(page: number) {
  if (companyId.value) {
    const hasFilters = Object.keys(currentFilters.value).some(
      (key) => currentFilters.value[key as keyof FiltersType] !== undefined && currentFilters.value[key as keyof FiltersType] !== ''
    )
    if (hasFilters) {
      await searchOrders(companyId.value, currentFilters.value, page)
    } else {
      await loadOrders(page)
    }
  }
}
</script>

<style scoped>
.service-orders-view {
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

.orders-grid {
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
