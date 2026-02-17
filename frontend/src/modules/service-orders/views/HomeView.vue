<template>
  <DashboardLayout>
    <div class="home-view">
      <div class="home-content">
        <h1 class="home-title">Bem-vindo ao ServiCore</h1>
        <p class="home-subtitle">Sistema de gestão de ordens de serviço</p>
        
        <div class="home-stats">
          <div class="stat-card">
            <div class="stat-value">{{ ordersCount }}</div>
            <div class="stat-label">Ordens de Serviço</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ pendingCount }}</div>
            <div class="stat-label">Pendentes</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ completedCount }}</div>
            <div class="stat-label">Concluídas</div>
          </div>
        </div>

        <div class="home-actions">
          <Button @click="goToOrders">
            Ver Todas as Ordens
          </Button>
          <Button variant="primary" @click="goToCreate">
            Nova Ordem de Serviço
          </Button>
        </div>

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
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useServiceOrder } from '../composables/useServiceOrder'
import { useCompanyStore } from '@/shared/stores/company.store'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Button from '@/shared/components/ui/Button.vue'
import ServiceOrderCard from '../components/ServiceOrderCard.vue'

const companyStore = useCompanyStore()
const { orders, loadOrders, goToDetails, goToCreate, goToOrders } = useServiceOrder()

const ordersCount = computed(() => orders.value.length)
const pendingCount = computed(() => {
  return orders.value.filter(
    (o) => !['COMPLETED', 'CANCELLED'].includes(o.status)
  ).length
})
const completedCount = computed(() => {
  return orders.value.filter((o) => o.status === 'COMPLETED').length
})

const recentOrders = computed(() => {
  return orders.value.slice(0, 6)
})

onMounted(async () => {
  if (companyStore.companyId) {
    await loadOrders(1, 10)
  }
})

function goToOrders() {
  goToOrders()
}
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
</style>


