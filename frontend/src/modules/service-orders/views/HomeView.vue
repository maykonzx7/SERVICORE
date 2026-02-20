<template>
  <div class="home-view">
      <div class="home-content">
        <h1 class="home-title">Bem-vindo ao ServiCore</h1>
        <p class="home-subtitle">Sistema de gestão de ordens de serviço</p>
        
        <div v-if="!companyStore.companyId" class="home-warning">
          <EmptyState
            icon="🏢"
            title="Nenhuma empresa selecionada"
            description="Selecione uma empresa para visualizar as estatísticas"
          >
            <template #actions>
              <Button @click="$router.push({ name: 'CompanySelection' })">
                Selecionar Empresa
              </Button>
            </template>
          </EmptyState>
        </div>

        <div v-else>
          <div v-if="loading" class="home-loading">
            <Loading message="Carregando dados do dashboard..." />
          </div>

          <div v-else-if="error" class="home-error">
            <Card>
              <div class="error-content">
                <p class="error-message">Erro ao carregar dados: {{ error }}</p>
                <Button variant="outline" size="sm" @click="loadData">
                  Tentar Novamente
                </Button>
              </div>
            </Card>
          </div>

          <div v-else class="dashboard-grid">
            <div class="dashboard-kpis">
              <KPIWidget
                title="Total de Ordens"
                :value="ordersCount"
                icon="📋"
                variant="primary"
              />
              <KPIWidget
                title="Pendentes"
                :value="pendingCount"
                icon="⏳"
                variant="warning"
              />
              <KPIWidget
                title="Em Progresso"
                :value="inProgressCount"
                icon="🔄"
                variant="info"
              />
              <KPIWidget
                title="Concluídas"
                :value="completedCount"
                icon="✅"
                variant="success"
              />
            </div>

            <div class="dashboard-widgets">
              <ChartWidget
                title="Ordens por Status"
                subtitle="Últimos 30 dias"
                :loading="loading"
              >
                <div class="chart-placeholder-content">
                  <p>Gráfico de pizza será implementado aqui</p>
                </div>
              </ChartWidget>

              <ActivityWidget
                title="Atividades Recentes"
                :activities="recentActivities"
                :loading="loading"
                :view-all-link="{ name: ROUTE_NAMES.SERVICE_ORDERS }"
              />
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
            <EmptyState
              icon="📋"
              title="Nenhuma ordem de serviço encontrada"
              description="Comece criando sua primeira ordem de serviço"
            >
              <template #actions>
                <Button @click="goToCreate">
                  Criar Primeira Ordem
                </Button>
              </template>
            </EmptyState>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useServiceOrder } from '../composables/useServiceOrder'
import { useCompanyStore } from '@/shared/stores/company.store'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import Button from '@/shared/components/ui/Button.vue'
import Card from '@/shared/components/ui/Card.vue'
import Loading from '@/shared/components/ui/Loading.vue'
import EmptyState from '@/shared/components/ui/EmptyState.vue'
import ServiceOrderCard from '../components/ServiceOrderCard.vue'
import KPIWidget from '@/shared/components/dashboard/KPIWidget.vue'
import ChartWidget from '@/shared/components/dashboard/ChartWidget.vue'
import ActivityWidget from '@/shared/components/dashboard/ActivityWidget.vue'

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

const recentActivities = computed(() => {
  return orders.value.slice(0, 5).map((order) => ({
    id: order.id,
    type: 'service-order' as const,
    text: `Ordem #${order.number} - ${order.title || 'Sem título'}`,
    time: order.createdAt,
    link: { name: ROUTE_NAMES.SERVICE_ORDER_DETAILS, params: { id: order.id } },
  }))
})

async function loadData() {
  if (!companyStore.companyId) {
    return
  }
  
  try {
    await loadOrders(1, 20) // Carregar mais ordens para o dashboard
  } catch (err: any) {
    console.error('Erro ao carregar ordens:', err)
  }
}

onMounted(async () => {
  // Se não tem empresa, tentar carregar do localStorage
  if (!companyStore.companyId && !companyStore.currentCompany) {
    await companyStore.loadCurrentCompany()
  }
  
  // Aguardar um pouco para garantir que a empresa foi carregada
  await new Promise((resolve) => setTimeout(resolve, 200))
  
  if (companyStore.companyId) {
    await loadData()
  }
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
  padding: 0;
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

.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

.dashboard-kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 1.5rem;
}

.dashboard-widgets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 1.5rem;
}

.chart-placeholder-content {
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
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

.home-warning {
  padding: 2rem;
  margin-bottom: 2rem;
}

.home-loading {
  padding: 3rem;
}

.home-error {
  margin-bottom: 2rem;
}

.error-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
}

.error-message {
  color: #991b1b;
  font-size: 0.875rem;
  margin: 0;
  text-align: center;
}

.home-empty {
  padding: 3rem 1rem;
}
</style>


