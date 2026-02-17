<template>
  <DashboardLayout>
    <div class="profile-view">
      <div class="view-header">
        <h1 class="view-title">Meu Perfil</h1>
      </div>

      <div v-if="loading" class="view-loading">
        Carregando perfil...
      </div>

      <div v-else-if="error" class="view-error">
        {{ error }}
        <Button variant="outline" size="sm" @click="loadProfile">
          Tentar Novamente
        </Button>
      </div>

      <div v-else class="view-content">
        <div class="profile-sections">
          <!-- Informações Pessoais -->
          <div class="profile-section">
            <h2 class="section-title">Informações Pessoais</h2>
            <form @submit.prevent="handleUpdateProfile" class="profile-form">
              <div class="form-group">
                <Input
                  v-model="profileForm.name"
                  label="Nome"
                  placeholder="Seu nome completo"
                  :error="errors.name"
                />
              </div>
              <div class="form-group">
                <Input
                  v-model="profileForm.email"
                  type="email"
                  label="E-mail"
                  placeholder="seu@email.com"
                  :error="errors.email"
                  disabled
                />
                <small class="form-hint">O e-mail não pode ser alterado</small>
              </div>
              <div v-if="errors.general" class="form-error">
                {{ errors.general }}
              </div>
              <div class="form-actions">
                <Button
                  type="submit"
                  :loading="saving"
                  :disabled="!hasProfileChanges"
                >
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </div>

          <!-- Alterar Senha -->
          <div class="profile-section">
            <h2 class="section-title">Alterar Senha</h2>
            <form @submit.prevent="handleChangePassword" class="profile-form">
              <div class="form-group">
                <Input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  label="Senha Atual"
                  placeholder="Digite sua senha atual"
                  :error="errors.currentPassword"
                />
              </div>
              <div class="form-group">
                <Input
                  v-model="passwordForm.newPassword"
                  type="password"
                  label="Nova Senha"
                  placeholder="Digite a nova senha"
                  :error="errors.newPassword"
                />
              </div>
              <div class="form-group">
                <Input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  label="Confirmar Nova Senha"
                  placeholder="Confirme a nova senha"
                  :error="errors.confirmPassword"
                />
              </div>
              <div v-if="errors.password" class="form-error">
                {{ errors.password }}
              </div>
              <div class="form-actions">
                <Button
                  type="submit"
                  :loading="changingPassword"
                  :disabled="!isPasswordFormValid"
                >
                  Alterar Senha
                </Button>
              </div>
            </form>
          </div>

          <!-- Informações da Conta -->
          <div class="profile-section">
            <h2 class="section-title">Informações da Conta</h2>
            <div class="account-info">
              <div class="info-item">
                <span class="info-label">ID do Usuário:</span>
                <span class="info-value">{{ user?.id }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">E-mail:</span>
                <span class="info-value">{{ user?.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Roles:</span>
                <span class="info-value">
                  <span
                    v-for="role in user?.roles"
                    :key="role"
                    class="role-badge"
                  >
                    {{ role }}
                  </span>
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Conta criada em:</span>
                <span class="info-value">{{ formatDate(user?.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/shared/stores/auth.store'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import { formatDate } from '@/shared/utils/formatters'

const authStore = useAuthStore()

const loading = ref(false)
const saving = ref(false)
const changingPassword = ref(false)
const error = ref<string | null>(null)
const errors = ref<Record<string, string>>({})

const user = computed(() => authStore.user)

const profileForm = ref({
  name: '',
  email: '',
})

const originalProfile = ref({
  name: '',
  email: '',
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const hasProfileChanges = computed(() => {
  return profileForm.value.name !== originalProfile.value.name
})

const isPasswordFormValid = computed(() => {
  return (
    passwordForm.value.currentPassword.length > 0 &&
    passwordForm.value.newPassword.length >= 6 &&
    passwordForm.value.newPassword === passwordForm.value.confirmPassword
  )
})

onMounted(async () => {
  await loadProfile()
})

async function loadProfile() {
  loading.value = true
  error.value = null
  try {
    await authStore.loadCurrentUser()
    if (authStore.user) {
      profileForm.value = {
        name: authStore.user.name || '',
        email: authStore.user.email,
      }
      originalProfile.value = { ...profileForm.value }
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao carregar perfil'
  } finally {
    loading.value = false
  }
}

async function handleUpdateProfile() {
  errors.value = {}
  saving.value = true

  try {
    await authStore.updateProfile({
      name: profileForm.value.name,
    })
    originalProfile.value = { ...profileForm.value }
    alert('Perfil atualizado com sucesso!')
  } catch (err: any) {
    errors.value.general = err.response?.data?.message || 'Erro ao atualizar perfil'
    if (err.response?.data?.errors) {
      errors.value = { ...errors.value, ...err.response.data.errors }
    }
  } finally {
    saving.value = false
  }
}

async function handleChangePassword() {
  errors.value = {}

  if (passwordForm.value.newPassword.length < 6) {
    errors.value.newPassword = 'A senha deve ter pelo menos 6 caracteres'
    return
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errors.value.confirmPassword = 'As senhas não coincidem'
    return
  }

  changingPassword.value = true

  try {
    await authStore.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
      confirmPassword: passwordForm.value.confirmPassword,
    })
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
    alert('Senha alterada com sucesso!')
  } catch (err: any) {
    errors.value.password = err.response?.data?.message || 'Erro ao alterar senha'
    if (err.response?.data?.errors) {
      errors.value = { ...errors.value, ...err.response.data.errors }
    }
  } finally {
    changingPassword.value = false
  }
}
</script>

<style scoped>
.profile-view {
  max-width: 64rem;
  margin: 0 auto;
}

.view-header {
  margin-bottom: 2rem;
}

.view-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
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
  margin-bottom: 1.5rem;
}

.view-content {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
}

.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-section {
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.profile-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.form-error {
  padding: 0.75rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  color: #991b1b;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 1rem;
  color: #111827;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: #dbeafe;
  color: #1e40af;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>

