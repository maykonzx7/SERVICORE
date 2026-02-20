<template>
  <div class="users-view">
      <div class="users-header">
        <h1 class="users-title">Usuários</h1>
        <Button v-if="canCreate" @click="openCreateModal">Novo Usuário</Button>
      </div>

      <div class="users-filters">
        <Input
          v-model="filters.search"
          label="Buscar"
          placeholder="Nome ou email"
        />

        <div class="filter-field">
          <label class="filter-label" for="roleFilter">Role</label>
          <select id="roleFilter" v-model="filters.role" class="filter-select">
            <option value="">Todos</option>
            <option v-for="role in availableRoles" :key="role" :value="role">
              {{ role }}
            </option>
          </select>
        </div>

        <div class="filter-field">
          <label class="filter-label" for="activeFilter">Status</label>
          <select id="activeFilter" v-model="filters.active" class="filter-select">
            <option value="">Todos</option>
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>

        <div class="filter-actions">
          <Button variant="outline" @click="applyFilters">Aplicar</Button>
          <Button variant="outline" @click="clearFilters">Limpar</Button>
        </div>
      </div>

      <p v-if="errorMessage" class="users-error">{{ errorMessage }}</p>

      <Table
        :headers="tableHeaders"
        :items="users"
        :loading="loading"
        @rowClick="goToDetails"
      >
        <template #cell-name="{ item }">
          <span class="name-cell">{{ item.name || '-' }}</span>
        </template>

        <template #cell-email="{ item }">
          <span class="email-cell">{{ item.email }}</span>
        </template>

        <template #cell-roles="{ item }">
          <span class="roles-cell">{{ item.roles.join(', ') }}</span>
        </template>

        <template #cell-active="{ item }">
          <span :class="['status-badge', item.active ? 'status-active' : 'status-inactive']">
            {{ item.active ? 'Ativo' : 'Inativo' }}
          </span>
        </template>

        <template #cell-createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>

        <template #cell-actions="{ item }">
          <div class="row-actions" @click.stop>
            <Button
              variant="outline"
              size="sm"
              @click="goToDetails(item as ManagedUser)"
            >
              Ver
            </Button>
            <Button
              v-if="canUpdate"
              variant="outline"
              size="sm"
              @click="goToEdit(item as ManagedUser)"
            >
              Editar
            </Button>
          </div>
        </template>
      </Table>

      <div class="pagination">
        <span class="pagination-info">
          Página {{ pagination.page }} de {{ pagination.totalPages }} - Total: {{ pagination.total }}
        </span>
        <div class="pagination-actions">
          <Button
            variant="outline"
            :disabled="pagination.page <= 1 || loading"
            @click="changePage(pagination.page - 1)"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            :disabled="pagination.page >= pagination.totalPages || loading"
            @click="changePage(pagination.page + 1)"
          >
            Próxima
          </Button>
        </div>
      </div>

    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import Table from '@/shared/components/ui/Table.vue'
import { userManagementApi } from '../api/user-management.api'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import type {
  ListUsersParams,
  ManagedUser,
  UserPagination,
} from '../types/user-management.types'

const authStore = useAuthStore()
const canCreate = computed(() => authStore.hasPermission('user:create'))
const canUpdate = computed(() => authStore.hasPermission('user:update'))

interface FilterState {
  search: string
  role: string
  active: '' | 'true' | 'false'
}

const loading = ref(false)
const availableRoles = ref<string[]>([])
const users = ref<ManagedUser[]>([])
const errorMessage = ref<string>('')

const pagination = ref<UserPagination>({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
})

const filters = reactive<FilterState>({
  search: '',
  role: '',
  active: '',
})

const router = useRouter()

const tableHeaders = [
  { key: 'name', label: 'Nome' },
  { key: 'email', label: 'Email' },
  { key: 'roles', label: 'Roles' },
  { key: 'active', label: 'Status' },
  { key: 'createdAt', label: 'Criado em' },
  { key: 'actions', label: 'Ações' },
]

onMounted(async () => {
  await Promise.all([loadRoles(), loadUsers(1)])
})

function buildQuery(page: number): ListUsersParams {
  return {
    page,
    limit: pagination.value.limit,
    search: filters.search || undefined,
    role: filters.role || undefined,
    active:
      filters.active === ''
        ? undefined
        : filters.active === 'true',
  }
}

async function loadUsers(page: number): Promise<void> {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await userManagementApi.listUsers(buildQuery(page))
    users.value = response.data
    pagination.value = response.pagination
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Falha ao carregar usuários'
  } finally {
    loading.value = false
  }
}

async function loadRoles(): Promise<void> {
  try {
    availableRoles.value = await userManagementApi.listRoles()
  } catch (err) {
    availableRoles.value = ['USER']
  }
}

function applyFilters() {
  loadUsers(1)
}

function clearFilters() {
  filters.search = ''
  filters.role = ''
  filters.active = ''
  loadUsers(1)
}

function changePage(page: number) {
  loadUsers(page)
}

function openCreateModal() {
  router.push({ name: ROUTE_NAMES.USER_CREATE })
}

function goToDetails(user: ManagedUser) {
  router.push({
    name: ROUTE_NAMES.USER_DETAILS,
    params: { id: user.id },
  })
}

function goToEdit(user: ManagedUser) {
  router.push({
    name: ROUTE_NAMES.USER_EDIT,
    params: { id: user.id },
  })
}


function formatDate(value: string): string {
  return new Date(value).toLocaleString('pt-BR')
}
</script>

<style scoped>
.users-view {
  max-width: 90rem;
  margin: 0 auto;
}

.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.users-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.users-filters {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: end;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.filter-select {
  height: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0 0.75rem;
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
}

.users-error {
  margin: 0 0 1rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.name-cell,
.email-cell {
  white-space: normal;
}

.email-cell {
  color: #3b82f6;
  cursor: pointer;
}

.email-cell:hover {
  text-decoration: underline;
}

.roles-cell {
  white-space: normal;
}

.status-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-active {
  color: #065f46;
  background-color: #d1fae5;
}

.status-inactive {
  color: #991b1b;
  background-color: #fee2e2;
}

.row-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.pagination-info {
  color: #4b5563;
  font-size: 0.875rem;
}

.pagination-actions {
  display: flex;
  gap: 0.5rem;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-checkbox {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.roles-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.roles-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.roles-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 0.5rem;
}

.role-option {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

@media (max-width: 1024px) {
  .users-filters {
    grid-template-columns: 1fr;
  }

  .pagination {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>

