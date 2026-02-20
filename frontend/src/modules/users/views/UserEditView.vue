<template>
  <DashboardLayout>
    <div class="user-form-view">
      <div v-if="loading" class="view-loading">
        Carregando usuário...
      </div>

      <div v-else-if="error" class="view-error">
        {{ error }}
        <Button variant="outline" size="sm" @click="loadUser">
          Tentar Novamente
        </Button>
      </div>

      <div v-else class="form-content">
        <div class="form-header">
          <h1 class="form-title">Editar Usuário</h1>
          <Button variant="outline" @click="goBack">
            Voltar
          </Button>
        </div>

        <form class="user-form" @submit.prevent="submitForm">
          <Input
            v-model="form.email"
            label="Email"
            type="email"
            required
            :error="errors.email"
          />

          <Input
            v-model="form.name"
            label="Nome"
            :error="errors.name"
          />

          <div class="form-checkbox">
            <input id="activeField" v-model="form.active" type="checkbox" />
            <label for="activeField">Usuário ativo</label>
          </div>

          <div class="roles-section">
            <p class="roles-title">Roles *</p>
            <div class="roles-options">
              <label
                v-for="role in availableRoles"
                :key="role"
                class="role-option"
              >
                <input
                  type="checkbox"
                  :checked="form.roles.includes(role)"
                  @change="toggleRole(role)"
                />
                <span>{{ role }}</span>
              </label>
            </div>
            <p v-if="errors.roles" class="error-message">{{ errors.roles }}</p>
          </div>

          <p v-if="submitError" class="error-message">{{ submitError }}</p>

          <div class="form-actions">
            <Button variant="outline" type="button" @click="goBack">
              Cancelar
            </Button>
            <Button type="submit" :loading="submitting">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import { userManagementApi } from '../api/user-management.api'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import type { UpdateUserPayload } from '../types/user-management.types'

interface UserFormState {
  email: string
  name: string
  active: boolean
  roles: string[]
}

interface FormErrors {
  email?: string
  name?: string
  roles?: string
}

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref<string>('')
const availableRoles = ref<string[]>([])
const submitting = ref(false)
const submitError = ref<string>('')

const form = reactive<UserFormState>({
  email: '',
  name: '',
  active: true,
  roles: ['USER'],
})

const errors = reactive<FormErrors>({})

onMounted(async () => {
  await Promise.all([loadUser(), loadRoles()])
})

async function loadUser() {
  loading.value = true
  error.value = ''
  try {
    const id = route.params.id as string
    const data = await userManagementApi.getUserById(id)
    form.email = data.email
    form.name = data.name || ''
    form.active = data.active
    form.roles = [...data.roles]
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

function toggleRole(role: string) {
  if (form.roles.includes(role)) {
    form.roles = form.roles.filter((r) => r !== role)
  } else {
    form.roles = [...form.roles, role]
  }
  errors.roles = undefined
}

function validateForm(): boolean {
  Object.keys(errors).forEach((key) => {
    errors[key as keyof FormErrors] = undefined
  })

  if (!form.email) {
    errors.email = 'Email é obrigatório'
    return false
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email inválido'
    return false
  }

  if (form.roles.length === 0) {
    errors.roles = 'Selecione ao menos um role'
    return false
  }

  return true
}

async function submitForm() {
  if (!validateForm()) {
    return
  }

  submitting.value = true
  submitError.value = ''

  try {
    const id = route.params.id as string
    const payload: UpdateUserPayload = {
      email: form.email,
      name: form.name || undefined,
      active: form.active,
      roles: form.roles,
    }

    await userManagementApi.updateUser(id, payload)
    await userManagementApi.assignRoles(id, { roles: form.roles })
    router.push({
      name: ROUTE_NAMES.USER_DETAILS,
      params: { id },
    })
  } catch (err: any) {
    submitError.value = err.response?.data?.message || 'Falha ao atualizar usuário'
  } finally {
    submitting.value = false
  }
}

function goBack() {
  const id = route.params.id as string
  router.push({
    name: ROUTE_NAMES.USER_DETAILS,
    params: { id },
  })
}
</script>

<style scoped>
.user-form-view {
  max-width: 48rem;
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

.form-content {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  gap: 0.5rem;
  align-items: center;
  font-size: 0.875rem;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>

