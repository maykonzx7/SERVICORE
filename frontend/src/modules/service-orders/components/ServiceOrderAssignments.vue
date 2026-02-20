<template>
  <Card>
    <div class="assignments-section">
      <div class="section-header">
        <h3 class="section-title">Atribuições</h3>
        <Button v-if="canAssign" size="sm" @click="showAssignModal = true">
          Atribuir
        </Button>
      </div>

      <div v-if="loading" class="loading-state">
        <Loading />
      </div>

      <div v-else-if="!assignments || assignments.length === 0" class="empty-state">
        <p>Nenhuma atribuição encontrada</p>
        <Button v-if="canAssign" variant="outline" size="sm" @click="showAssignModal = true">
          Atribuir Primeiro Usuário
        </Button>
      </div>

      <div v-else class="assignments-list">
        <div
          v-for="assignment in assignments"
          :key="assignment.id"
          class="assignment-item"
        >
          <div class="assignment-info">
            <div class="assignment-user">
              <strong>{{ assignment.userName }}</strong>
              <span v-if="assignment.userEmail" class="assignment-email">
                {{ assignment.userEmail }}
              </span>
            </div>
            <span :class="['assignment-type', `type-${assignment.type.toLowerCase()}`]">
              {{ getTypeLabel(assignment.type) }}
            </span>
          </div>
          <div class="assignment-meta">
            <small>{{ formatRelativeTime(assignment.assignedAt) }}</small>
            <Button
              v-if="canUnassign"
              variant="outline"
              size="sm"
              @click="handleUnassign(assignment.userId)"
            >
              Remover
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Atribuição -->
    <Modal v-model="showAssignModal" title="Atribuir Usuário" @close="resetForm">
      <div class="assign-form">
        <div class="form-field">
          <label class="form-label">Usuário</label>
          <Select
            v-model="form.userId"
            :options="userOptions"
            placeholder="Selecione um usuário"
          />
        </div>
        <div class="form-field">
          <label class="form-label">Tipo de Atribuição</label>
          <Select
            v-model="form.type"
            :options="typeOptions"
            placeholder="Selecione o tipo"
          />
        </div>
        <div class="form-actions">
          <Button variant="outline" @click="showAssignModal = false">
            Cancelar
          </Button>
          <Button :disabled="!form.userId || !form.type" @click="handleAssign">
            Atribuir
          </Button>
        </div>
      </div>
    </Modal>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/shared/stores/auth.store'
import { userManagementApi } from '@/modules/users/api/user-management.api'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import Select from '@/shared/components/ui/Select.vue'
import Loading from '@/shared/components/ui/Loading.vue'
import { formatRelativeTime } from '@/shared/utils/date'
import type { Assignment, AssignmentType } from '../types/service-order.types'
import type { ManagedUser } from '@/modules/users/types/user-management.types'

interface Props {
  orderId: string
  assignments?: Assignment[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  assign: [userId: string, type: AssignmentType]
  unassign: [userId: string]
}>()

const authStore = useAuthStore()
const canAssign = computed(() => authStore.hasPermission('service-order:assign'))
const canUnassign = computed(() => authStore.hasPermission('service-order:unassign'))

const showAssignModal = ref(false)
const users = ref<ManagedUser[]>([])
const loadingUsers = ref(false)

const form = ref({
  userId: '',
  type: 'PRIMARY' as AssignmentType,
})

const userOptions = computed(() => {
  return users.value.map(user => ({
    value: user.id,
    label: `${user.name} (${user.email})`,
  }))
})

const typeOptions = [
  { value: 'PRIMARY', label: 'Principal' },
  { value: 'AUXILIARY', label: 'Auxiliar' },
  { value: 'OBSERVER', label: 'Observador' },
]

onMounted(async () => {
  await loadUsers()
})

async function loadUsers() {
  loadingUsers.value = true
  try {
    const response = await userManagementApi.listUsers({ page: 1, limit: 100 })
    users.value = response.data
  } catch (err) {
    console.error('Erro ao carregar usuários:', err)
  } finally {
    loadingUsers.value = false
  }
}

function getTypeLabel(type: AssignmentType): string {
  const labels: Record<AssignmentType, string> = {
    PRIMARY: 'Principal',
    AUXILIARY: 'Auxiliar',
    OBSERVER: 'Observador',
  }
  return labels[type] || type
}

function handleAssign() {
  if (form.value.userId && form.value.type) {
    emit('assign', form.value.userId, form.value.type)
    resetForm()
    showAssignModal.value = false
  }
}

function handleUnassign(userId: string) {
  if (confirm('Deseja realmente remover esta atribuição?')) {
    emit('unassign', userId)
  }
}

function resetForm() {
  form.value = {
    userId: '',
    type: 'PRIMARY',
  }
}
</script>

<style scoped>
.assignments-section {
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.empty-state p {
  margin: 0 0 1rem 0;
}

.assignments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.assignment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.assignment-info {
  flex: 1;
}

.assignment-user {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.assignment-user strong {
  color: #111827;
  font-size: 0.875rem;
}

.assignment-email {
  color: #6b7280;
  font-size: 0.75rem;
}

.assignment-type {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.type-primary {
  background-color: #dbeafe;
  color: #1e40af;
}

.type-auxiliary {
  background-color: #fef3c7;
  color: #92400e;
}

.type-observer {
  background-color: #f3f4f6;
  color: #374151;
}

.assignment-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.assignment-meta small {
  color: #6b7280;
  font-size: 0.75rem;
}

.assign-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>

