<template>
  <div class="audit-logs">
    <div class="audit-header">
      <h2 class="section-title">Logs de Auditoria</h2>
      <div class="audit-filters">
        <Input
          v-model="filters.search"
          placeholder="Buscar..."
          @input="handleFilter"
        />
        <Select
          v-model="filters.action"
          :options="actionOptions"
          placeholder="Todas as ações"
          @update:model-value="handleFilter"
        />
        <Select
          v-model="filters.user"
          :options="userOptions"
          placeholder="Todos os usuários"
          @update:model-value="handleFilter"
        />
      </div>
    </div>

    <Card>
      <div class="audit-table">
        <Loading v-if="loading" />
        <EmptyState v-else-if="logs.length === 0" message="Nenhum log encontrado" />
        <table v-else>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Usuário</th>
              <th>Ação</th>
              <th>Módulo</th>
              <th>Detalhes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id">
              <td>{{ formatDateTime(log.timestamp) }}</td>
              <td>{{ log.user }}</td>
              <td>
                <Badge :variant="getActionVariant(log.action)">
                  {{ log.action }}
                </Badge>
              </td>
              <td>{{ log.module }}</td>
              <td>
                <button class="details-btn" @click="viewDetails(log)">
                  Ver detalhes
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Card from '@/shared/components/ui/Card.vue'
import Input from '@/shared/components/ui/Input.vue'
import Select from '@/shared/components/ui/Select.vue'
import Button from '@/shared/components/ui/Button.vue'
import Badge from '@/shared/components/ui/Badge.vue'
import Loading from '@/shared/components/ui/Loading.vue'
import EmptyState from '@/shared/components/ui/EmptyState.vue'
import { formatDateTime } from '@/shared/utils/date'

interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  module: string
  details: Record<string, unknown>
}

const logs = ref<AuditLog[]>([])
const loading = ref(false)
const filters = ref({
  search: '',
  action: undefined as string | undefined,
  user: undefined as string | undefined,
})

const pagination = ref({
  page: 1,
  totalPages: 1,
  total: 0,
})

const actionOptions = [
  { value: undefined, label: 'Todas as ações' },
  { value: 'create', label: 'Criar' },
  { value: 'update', label: 'Atualizar' },
  { value: 'delete', label: 'Deletar' },
  { value: 'view', label: 'Visualizar' },
]

const userOptions = [
  { value: undefined, label: 'Todos os usuários' },
  // TODO: Carregar usuários da API
]

onMounted(() => {
  loadLogs()
})

async function loadLogs() {
  loading.value = true
  try {
    // TODO: Implementar chamada à API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    logs.value = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        user: 'admin@example.com',
        action: 'create',
        module: 'service-order',
        details: { orderId: '123' },
      },
    ]
    pagination.value = {
      page: 1,
      totalPages: 1,
      total: 1,
    }
  } catch (error) {
    console.error('Erro ao carregar logs:', error)
  } finally {
    loading.value = false
  }
}

function handleFilter() {
  loadLogs()
}

function changePage(page: number) {
  pagination.value.page = page
  loadLogs()
}

function viewDetails(log: AuditLog) {
  // TODO: Abrir modal com detalhes
  alert(JSON.stringify(log.details, null, 2))
}

function getActionVariant(action: string): 'primary' | 'success' | 'warning' | 'danger' | 'info' {
  const variants: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    create: 'success',
    update: 'info',
    delete: 'danger',
    view: 'primary',
  }
  return variants[action] || 'primary'
}
</script>

<style scoped>
.audit-logs {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.audit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.audit-filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.audit-table {
  overflow-x: auto;
}

.audit-table table {
  width: 100%;
  border-collapse: collapse;
}

.audit-table th,
.audit-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.audit-table th {
  font-weight: 600;
  color: #374151;
  background-color: #f9fafb;
}

.audit-table td {
  color: #6b7280;
  font-size: 0.875rem;
}

.details-btn {
  padding: 0.25rem 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.details-btn:hover {
  background: #2563eb;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>

