<template>
  <div class="service-order-details-view">
      <div v-if="loading" class="view-loading">
        <Loading message="Carregando ordem de serviço..." />
      </div>

      <div v-else-if="error" class="view-error">
        <Card>
          <div class="error-content">
            <p class="error-message">{{ error }}</p>
            <Button variant="outline" size="sm" @click="loadOrder">
              Tentar Novamente
            </Button>
          </div>
        </Card>
      </div>

      <div v-else-if="order" class="view-content">
        <div class="details-header">
          <div>
            <h1 class="details-title">Ordem de Serviço #{{ order.id.slice(0, 8) }}</h1>
            <p class="details-subtitle">{{ order.description || 'Sem descrição' }}</p>
          </div>
          <ServiceOrderActions
            :order="order"
            :loading="actionLoading"
            @start="handleStart"
            @complete="handleComplete"
            @cancel="handleCancel"
            @edit="goToEdit"
          />
        </div>

        <div class="details-info">
          <Card>
            <div class="info-section">
              <h3 class="section-title">Informações Gerais</h3>
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
                  <span class="info-value">{{ formatMoney(order.value || 0) }}</span>
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
          </Card>

          <Card v-if="order.description">
            <div class="info-section">
              <h3 class="section-title">Descrição</h3>
              <p class="description-text">{{ order.description }}</p>
            </div>
          </Card>

          <ServiceOrderAssignments
            :order-id="order.id"
            :assignments="order.assignments"
            :loading="assignmentsLoading"
            @assign="handleAssign"
            @unassign="handleUnassign"
          />

          <ServiceOrderHistory
            :history="history"
            :loading="historyLoading"
          />

          <ServiceOrderTransactions
            :service-order-id="order.id"
            :initial-amount="order.value"
          />
        </div>

      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useServiceOrder } from '../composables/useServiceOrder'
import Button from '@/shared/components/ui/Button.vue'
import Card from '@/shared/components/ui/Card.vue'
import Loading from '@/shared/components/ui/Loading.vue'
import ServiceOrderActions from '../components/ServiceOrderActions.vue'
import ServiceOrderAssignments from '../components/ServiceOrderAssignments.vue'
import ServiceOrderHistory from '../components/ServiceOrderHistory.vue'
import ServiceOrderTransactions from '../components/ServiceOrderTransactions.vue'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import { SERVICE_ORDER_STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/shared/constants/enums'
import { formatMoney, formatDateTime } from '@/shared/utils/formatters'
import type { AssignmentType, ServiceOrderHistory as ServiceOrderHistoryType } from '../types/service-order.types'

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
  assignUser,
  unassignUser,
  loadHistory,
} = useServiceOrder()

const order = computed(() => currentOrder.value)
const actionLoading = ref(false)
const assignmentsLoading = ref(false)
const historyLoading = ref(false)
const history = ref<ServiceOrderHistoryType[]>([])

onMounted(async () => {
  const id = route.params.id as string
  await loadOrderById(id)
  await loadOrderHistory(id)
})

async function loadOrderHistory(id: string) {
  historyLoading.value = true
  try {
    history.value = await loadHistory(id)
  } catch (err: any) {
    // Se for 404, o store já retornou array vazio, apenas logar
    if (err.response?.status !== 404) {
      console.error('Erro ao carregar histórico:', err)
    }
    // Se não for 404, manter histórico vazio
    if (!history.value) {
      history.value = []
    }
  } finally {
    historyLoading.value = false
  }
}

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

function goToEdit() {
  if (!order.value) return
  router.push({
    name: ROUTE_NAMES.SERVICE_ORDER_EDIT,
    params: { id: order.value.id },
  })
}

function getStatusLabel(status: string | undefined): string {
  if (!status) return 'N/A'
  const option = SERVICE_ORDER_STATUS_OPTIONS.find((opt) => opt.value === status)
  return option?.label || status
}

function getStatusClass(status: string | undefined): string {
  if (!status) return 'status-unknown'
  return `status-${status.toLowerCase().replace('_', '-')}`
}

function getPriorityLabel(priority: string | undefined): string {
  if (!priority) return 'N/A'
  const option = PRIORITY_OPTIONS.find((opt) => opt.value === priority)
  return option?.label || priority
}

function getPriorityClass(priority: string | undefined): string {
  if (!priority) return 'priority-unknown'
  return `priority-${priority.toLowerCase()}`
}

async function handleAssign(userId: string, type: AssignmentType) {
  if (!order.value) return
  assignmentsLoading.value = true
  try {
    await assignUser(order.value.id, userId, type)
    await loadOrderHistory(order.value.id)
  } finally {
    assignmentsLoading.value = false
  }
}

async function handleUnassign(userId: string) {
  if (!order.value) return
  assignmentsLoading.value = true
  try {
    await unassignUser(order.value.id, userId)
    await loadOrderHistory(order.value.id)
  } finally {
    assignmentsLoading.value = false
  }
}
</script>

<style scoped>
.service-order-details-view {
  max-width: 64rem;
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

.view-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-section {
  padding: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.description-text {
  color: #374151;
  line-height: 1.6;
  margin: 0;
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

.status-unknown {
  background-color: #f3f4f6;
  color: #6b7280;
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

.priority-unknown {
  background-color: #f3f4f6;
  color: #6b7280;
}
</style>
