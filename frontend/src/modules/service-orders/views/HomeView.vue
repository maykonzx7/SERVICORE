<template>
  <DashboardLayout>
    <div class="home-view">
      <div class="home-content">
        <h1 class="home-title">Bem-vindo ao ServiCore</h1>
        <p class="home-subtitle">Sistema de gestão de ordens de serviço</p>
        
        <div v-if="!companyStore.companyId" class="home-warning">
          <p>⚠️ Selecione uma empresa para visualizar as estatísticas.</p>
          <Button @click="$router.push({ name: 'CompanySelection' })">
            Selecionar Empresa
          </Button>
        </div>

        <div v-else>
          <div v-if="loading" class="home-loading">
            <p>Carregando dados...</p>
          </div>

          <div v-else-if="error" class="home-error">
            <p>Erro ao carregar dados: {{ error }}</p>
            <Button variant="outline" size="sm" @click="loadData">
              Tentar Novamente
            </Button>
          </div>

          <div v-else class="home-stats">
            <div class="stat-card">
              <div class="stat-value">{{ ordersCount }}</div>
              <div class="stat-label">Total de Ordens</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ pendingCount }}</div>
              <div class="stat-label">Pendentes</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ completedCount }}</div>
              <div class="stat-label">Concluídas</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ inProgressCount }}</div>
              <div class="stat-label">Em Progresso</div>
            </div>
          </div>
        </div>

        <div v-if="companyStore.companyId" class="home-actions">
          <Button @click="goToOrders">
            Ver Todas as Ordens
          </Button>
          <Button variant="primary" @click="goToCreate">
            Nova Ordem de Serviço
          </Button>
        </div>

        <div v-if="companyStore.companyId && !loading && !error">
          <div v-if="recentOrders.length > 0" class="home-recent">
            <h2 class="recent-title">Ordens Recentes</h2>
            <div class="recent-list">
              <ServiceOrderCard
                v-for="order in recentOrders"
                :key="order.id"
                :order="order"
                @click="goToDetails(order.id)"
              />
            </div>
          </div>
          <div v-else class="home-empty">
            <p>Nenhuma ordem de serviço encontrada.</p>
            <Button @click="goToCreate">
              Criar Primeira Ordem
            </Button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useServiceOrder } from '../composables/useServiceOrder'
import { useCompanyStore } from '@/shared/stores/company.store'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Button from '@/shared/components/ui/Button.vue'
import ServiceOrderCard from '../components/ServiceOrderCard.vue'

const companyStore = useCompanyStore()
const { orders, loading, error, loadOrders, goToDetails, goToCreate, goToOrders } = useServiceOrder()

const ordersCount = computed(() => orders.value.length)
const pendingCount = computed(() => {
  return orders.value.filter((o) => o.status === 'CREATED').length
})
const completedCount = computed(() => {
  return orders.value.filter((o) => o.status === 'COMPLETED').length
})
const inProgressCount = computed(() => {
  return orders.value.filter((o) => 
    ['STARTED', 'IN_PROGRESS'].includes(o.status)
  ).length
})

const recentOrders = computed(() => {
  return orders.value.slice(0, 6)
})

async function loadData() {
  if (companyStore.companyId) {
    try {
      console.log('Carregando ordens para empresa:', companyStore.companyId)
      await loadOrders(1, 10)
      console.log('Ordens carregadas:', orders.value.length)
    } catch (err) {
      console.error('Erro ao carregar ordens:', err)
    }
  } else {
    console.log('Nenhuma empresa selecionada')
  }
}

onMounted(async () => {
  // Aguardar um pouco para garantir que a empresa foi carregada
  await new Promise((resolve) => setTimeout(resolve, 100))
  await loadData()
})

watch(
  () => companyStore.companyId,
  async (newCompanyId, oldCompanyId) => {
    if (newCompanyId && newCompanyId !== oldCompanyId) {
      await loadData()
    }
  },
  { immediate: false }
)
</script>

<style scoped>
.home-view {
  max-width: 80rem;
  margin: 0 auto;
}

.home-content {
  padding: 2rem;
}

.home-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.home-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0 0 3rem 0;
  text-align: center;
}

.home-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.home-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.home-recent {
  margin-top: 3rem;
}

.recent-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
}

.recent-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 1.5rem;
}

.home-warning,
.home-loading,
.home-error,
.home-empty {
  text-align: center;
  padding: 2rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}

.home-warning {
  background: #fef3c7;
  border-color: #fde68a;
  color: #92400e;
}

.home-error {
  background: #fee2e2;
  border-color: #fecaca;
  color: #991b1b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.home-empty {
  color: #6b7280;
}
</style>


