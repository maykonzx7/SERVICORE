<template>
  <DashboardLayout>
    <div class="service-order-create-view">
      <div class="view-header">
        <h1 class="view-title">Criar Ordem de Serviço</h1>
        <Button variant="outline" @click="goBack">
          Voltar
        </Button>
      </div>

      <div class="view-content">
        <ServiceOrderForm @submit="handleSubmit" @cancel="goBack" />
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useServiceOrder } from '../composables/useServiceOrder'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Button from '@/shared/components/ui/Button.vue'
import ServiceOrderForm from '../components/ServiceOrderForm.vue'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const router = useRouter()
const { goToDetails } = useServiceOrder()

function handleSubmit() {
  router.push({ name: ROUTE_NAMES.SERVICE_ORDERS })
}

function goBack() {
  router.push({ name: ROUTE_NAMES.SERVICE_ORDERS })
}
</script>

<style scoped>
.service-order-create-view {
  max-width: 48rem;
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

.view-content {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
}
</style>
