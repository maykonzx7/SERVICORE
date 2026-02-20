<template>
  <div class="service-order-edit-view">
      <div v-if="loading && !order" class="view-loading">
        <Loading message="Carregando ordem de serviço..." />
      </div>

      <div v-else-if="error && !order" class="view-error">
        <Card>
          <div class="error-content">
            <p class="error-message">{{ error }}</p>
            <Button variant="outline" size="sm" @click="loadOrder">
              Tentar Novamente
            </Button>
          </div>
        </Card>
      </div>

      <div v-else-if="order" class="view-content-wrapper">
        <div class="view-header">
          <div>
            <h1 class="view-title">Editar Ordem de Serviço</h1>
            <p class="view-subtitle">Ordem #{{ order.id.slice(0, 8) }}</p>
          </div>
          <Button variant="outline" @click="goBack">
            Cancelar
          </Button>
        </div>

        <div class="view-content">
          <ServiceOrderForm
            :order="order"
            @submit="handleSubmit"
            @cancel="goBack"
          />
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useServiceOrder } from '../composables/useServiceOrder'
import Button from '@/shared/components/ui/Button.vue'
import Loading from '@/shared/components/ui/Loading.vue'
import Card from '@/shared/components/ui/Card.vue'
import ServiceOrderForm from '../components/ServiceOrderForm.vue'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const route = useRoute()
const router = useRouter()
const {
  currentOrder,
  loading,
  error,
  loadOrderById,
  updateOrder,
} = useServiceOrder()

const order = computed(() => currentOrder.value)

onMounted(async () => {
  const id = route.params.id as string
  await loadOrderById(id)
})

async function loadOrder() {
  const id = route.params.id as string
  await loadOrderById(id)
}

async function handleSubmit() {
  if (!order.value) return
  
  // O ServiceOrderForm já atualiza a ordem no store
  // Apenas navegar para a página de detalhes
  router.push({
    name: ROUTE_NAMES.SERVICE_ORDER_DETAILS,
    params: { id: order.value.id },
  })
}

function goBack() {
  if (order.value) {
    router.push({
      name: ROUTE_NAMES.SERVICE_ORDER_DETAILS,
      params: { id: order.value.id },
    })
  } else {
    router.push({ name: ROUTE_NAMES.SERVICE_ORDERS })
  }
}
</script>

<style scoped>
.service-order-edit-view {
  max-width: 48rem;
  margin: 0 auto;
}

.view-loading {
  padding: 3rem;
}

.view-error {
  margin-bottom: 1.5rem;
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

.view-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.view-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.view-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.view-content {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>

