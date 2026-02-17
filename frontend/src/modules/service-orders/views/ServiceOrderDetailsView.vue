<template>
  <DashboardLayout>
    <div class="service-order-details-view">
      <div v-if="loading" class="view-loading">
        Carregando ordem de serviço...
      </div>

      <div v-else-if="error" class="view-error">
        {{ error }}
        <Button variant="outline" size="sm" @click="loadOrder">
          Tentar Novamente
        </Button>
      </div>

      <div v-else-if="order" class="view-content">
        <div class="details-header">
          <div>
            <h1 class="details-title">Ordem de Serviço #{{ order.id.slice(0, 8) }}</h1>
            <p class="details-subtitle">{{ order.description }}</p>
          </div>
          <ServiceOrderActions
            :order="order"
            :loading="actionLoading"
            @start="handleStart"
            @complete="handleComplete"
            @cancel="handleCancel"
            @edit="handleEdit"
          />
        </div>

        <div class="details-info">
          <div class="info-section">
            <h3>Informações</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Status:</span>
                <span :class="['info-value', 'status-badge', getStatusClass(order.status)]">
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Prioridade:</span>
                <span :class="['info-value', 'priority-badge', getPriorityClass(order.priority)]">
                  {{ getPriorityLabel(order.priority) }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Valor:</span>
                <span class="info-value">{{ formatMoney(order.value) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Criado em:</span>
                <span class="info-value">{{ formatDateTime(order.createdAt) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Atualizado em:</span>
                <span class="info-value">{{ formatDateTime(order.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal de edição -->
        <Modal v-model="showEditModal" title="Editar Ordem de Serviço" @close="showEditModal = false">
          <ServiceOrderForm
            :order="order"
            @submit="handleUpdate"
            @cancel="showEditModal = false"
          />
        </Modal>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useServiceOrder } from '../composables/useServiceOrder'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Button from '@/shared/components/ui/Button.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import ServiceOrderActions from '../components/ServiceOrderActions.vue'
import ServiceOrderForm from '../components/ServiceOrderForm.vue'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import { SERVICE_ORDER_STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/shared/constants/enums'
import { formatMoney, formatDateTime } from '@/shared/utils/formatters'

const route = useRoute()
const router = useRouter()
const {
  currentOrder,
  loading,
  error,
  loadOrderById,
  startOrder,
  completeOrder,
  cancelOrder,
  updateOrder,
} = useServiceOrder()

const order = computed(() => currentOrder.value)
const actionLoading = ref(false)
const showEditModal = ref(false)

onMounted(async () => {
  const id = route.params.id as string
  await loadOrderById(id)
})

async function loadOrder() {
  const id = route.params.id as string
  await loadOrderById(id)
}

async function handleStart() {
  if (!order.value) return
  actionLoading.value = true
  try {
    await startOrder(order.value.id)
  } finally {
    actionLoading.value = false
  }
}

async function handleComplete() {
  if (!order.value) return
  actionLoading.value = true
  try {
    await completeOrder(order.value.id)
  } finally {
    actionLoading.value = false
  }
}

async function handleCancel() {
  if (!order.value) return
  actionLoading.value = true
  try {
    await cancelOrder(order.value.id)
  } finally {
    actionLoading.value = false
  }
}

async function handleUpdate() {
  if (!order.value) return
  try {
    await loadOrder()
    showEditModal.value = false
  } catch (err) {
    // Erro já está no store
  }
}

function handleEdit() {
  showEditModal.value = true
}

function getStatusLabel(status: string): string {
  const option = SERVICE_ORDER_STATUS_OPTIONS.find((opt) => opt.value === status)
  return option?.label || status
}

function getStatusClass(status: string): string {
  return `status-${status.toLowerCase().replace('_', '-')}`
}

function getPriorityLabel(priority: string): string {
  const option = PRIORITY_OPTIONS.find((opt) => opt.value === priority)
  return option?.label || priority
}

function getPriorityClass(priority: string): string {
  return `priority-${priority.toLowerCase()}`
}
</script>

<style scoped>
.service-order-details-view {
  max-width: 64rem;
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
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.details-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.details-info {
  margin-top: 1.5rem;
}

.info-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.info-value {
  font-size: 1rem;
  color: #111827;
}

.status-badge,
.priority-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  width: fit-content;
}

.status-created {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-started {
  background-color: #fef3c7;
  color: #92400e;
}

.status-in-progress {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-completed {
  background-color: #d1fae5;
  color: #065f46;
}

.status-cancelled {
  background-color: #fee2e2;
  color: #991b1b;
}

.priority-low {
  background-color: #d1fae5;
  color: #065f46;
}

.priority-medium {
  background-color: #fef3c7;
  color: #92400e;
}

.priority-high {
  background-color: #fee2e2;
  color: #991b1b;
}

.priority-critical {
  background-color: #f3e8ff;
  color: #6b21a8;
}
</style>
