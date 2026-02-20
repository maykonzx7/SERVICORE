<template>
  <DashboardLayout>
    <div class="user-details-view">
      <div v-if="loading" class="view-loading">
        Carregando usuário...
      </div>

      <div v-else-if="error" class="view-error">
        {{ error }}
        <Button variant="outline" size="sm" @click="loadUser">
          Tentar Novamente
        </Button>
      </div>

      <div v-else-if="user" class="view-content">
        <div class="details-header">
          <div>
            <h1 class="details-title">{{ user.name || user.email }}</h1>
            <p class="details-subtitle">{{ user.email }}</p>
          </div>
          <div class="header-actions">
            <Button variant="outline" @click="goToEdit">
              Editar
            </Button>
            <Button
              :variant="user.active ? 'danger' : 'success'"
              @click="toggleActive"
              :loading="actionLoading"
            >
              {{ user.active ? 'Desativar' : 'Ativar' }}
            </Button>
          </div>
        </div>

        <div class="details-info">
          <div class="info-section">
            <h3>Informações Pessoais</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Nome:</span>
                <span class="info-value">{{ user.name || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ user.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Status:</span>
                <span class="info-value">
                  <span :class="['status-badge', user.active ? 'status-active' : 'status-inactive']">
                    {{ user.active ? 'Ativo' : 'Inativo' }}
                  </span>
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Criado em:</span>
                <span class="info-value">{{ formatDateTime(user.createdAt) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Atualizado em:</span>
                <span class="info-value">{{ formatDateTime(user.updatedAt) }}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Roles e Permissões</h3>
            <div class="roles-list">
              <span
                v-for="role in user.roles"
                :key="role"
                class="role-badge"
              >
                {{ role }}
              </span>
              <span v-if="user.roles.length === 0" class="no-roles">
                Nenhum role atribuído
              </span>
            </div>
            <div class="section-actions">
              <Button variant="outline" size="sm" @click="showRolesModal = true">
                Gerenciar Roles
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de gerenciar roles -->
      <Modal
        v-model="showRolesModal"
        title="Gerenciar Roles"
        @close="showRolesModal = false"
      >
        <div class="roles-modal-content">
          <p class="modal-description">
            Selecione os roles para o usuário <strong>{{ user?.email }}</strong>
          </p>
          <div class="roles-options">
            <label
              v-for="role in availableRoles"
              :key="role"
              class="role-option"
            >
              <input
                type="checkbox"
                :checked="selectedRoles.includes(role)"
                @change="toggleRole(role)"
              />
              <span>{{ role }}</span>
            </label>
          </div>
          <p v-if="rolesError" class="error-message">{{ rolesError }}</p>
          <div class="modal-actions">
            <Button variant="outline" @click="showRolesModal = false">
              Cancelar
            </Button>
            <Button @click="saveRoles" :loading="savingRoles">
              Salvar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Button from '@/shared/components/ui/Button.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import { userManagementApi } from '../api/user-management.api'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import type { ManagedUser } from '../types/user-management.types'
import { formatDateTime } from '@/shared/utils/formatters'

const route = useRoute()
const router = useRouter()

const user = ref<ManagedUser | null>(null)
const loading = ref(false)
const error = ref<string>('')
const actionLoading = ref(false)
const showRolesModal = ref(false)
const availableRoles = ref<string[]>([])
const selectedRoles = ref<string[]>([])
const savingRoles = ref(false)
const rolesError = ref<string>('')

onMounted(async () => {
  await Promise.all([loadUser(), loadRoles()])
})

async function loadUser() {
  loading.value = true
  error.value = ''
  try {
    const id = route.params.id as string
    const data = await userManagementApi.getUserById(id)
    user.value = data
    selectedRoles.value = [...data.roles]
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Falha ao carregar usuário'
  } finally {
    loading.value = false
  }
}

async function loadRoles() {
  try {
    availableRoles.value = await userManagementApi.listRoles()
  } catch (err) {
    availableRoles.value = ['USER', 'ADMIN', 'MANAGER', 'TECHNICIAN', 'CLIENT']
  }
}

async function toggleActive() {
  if (!user.value) return
  actionLoading.value = true
  try {
    await userManagementApi.updateUser(user.value.id, {
      active: !user.value.active,
    })
    await loadUser()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Falha ao alterar status'
  } finally {
    actionLoading.value = false
  }
}

function goToEdit() {
  if (!user.value) return
  router.push({
    name: ROUTE_NAMES.USER_EDIT,
    params: { id: user.value.id },
  })
}

function toggleRole(role: string) {
  if (selectedRoles.value.includes(role)) {
    selectedRoles.value = selectedRoles.value.filter((r) => r !== role)
  } else {
    selectedRoles.value = [...selectedRoles.value, role]
  }
}

async function saveRoles() {
  if (!user.value) return
  if (selectedRoles.value.length === 0) {
    rolesError.value = 'Selecione ao menos um role'
    return
  }

  savingRoles.value = true
  rolesError.value = ''
  try {
    await userManagementApi.assignRoles(user.value.id, {
      roles: selectedRoles.value,
    })
    await loadUser()
    showRolesModal.value = false
  } catch (err: any) {
    rolesError.value = err.response?.data?.message || 'Falha ao salvar roles'
  } finally {
    savingRoles.value = false
  }
}
</script>

<style scoped>
.user-details-view {
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

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.details-info {
  margin-top: 1.5rem;
}

.info-section {
  margin-bottom: 2rem;
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

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  width: fit-content;
}

.status-active {
  background-color: #d1fae5;
  color: #065f46;
}

.status-inactive {
  background-color: #fee2e2;
  color: #991b1b;
}

.roles-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.role-badge {
  padding: 0.375rem 0.75rem;
  background-color: #eff6ff;
  color: #1e40af;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.no-roles {
  color: #6b7280;
  font-style: italic;
}

.section-actions {
  margin-top: 1rem;
}

.roles-modal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-description {
  margin: 0;
  color: #374151;
}

.roles-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 0.5rem;
}

.role-option {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.875rem;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>

