<template>
  <AuthLayout>
    <div class="password-reset-confirm-view">
      <h2 class="password-reset-confirm-title">Redefinir Senha</h2>
      <p class="password-reset-confirm-subtitle">
        Digite sua nova senha
      </p>
      <form @submit.prevent="handleSubmit" class="password-reset-confirm-form">
        <Input
          v-model="form.newPassword"
          type="password"
          label="Nova Senha"
          placeholder="••••••••"
          :error="errors.newPassword"
          required
        />
        <Input
          v-model="form.confirmPassword"
          type="password"
          label="Confirmar Nova Senha"
          placeholder="••••••••"
          :error="errors.confirmPassword"
          required
        />
        <div v-if="error" class="form-error">
          {{ error }}
        </div>
        <div v-if="success" class="form-success">
          Senha redefinida com sucesso! Redirecionando...
        </div>
        <Button
          type="submit"
          :loading="loading"
          :disabled="!isValid"
          class="form-submit"
        >
          Redefinir Senha
        </Button>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authApi } from '../api/auth.api'
import AuthLayout from '@/shared/layouts/AuthLayout.vue'
import Input from '@/shared/components/ui/Input.vue'
import Button from '@/shared/components/ui/Button.vue'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const route = useRoute()
const router = useRouter()

const form = ref({
  newPassword: '',
  confirmPassword: '',
})

const errors = ref<Record<string, string>>({})
const error = ref<string | null>(null)
const loading = ref(false)
const success = ref(false)

const isValid = computed(() => {
  return (
    form.value.newPassword.length >= 6 &&
    form.value.newPassword === form.value.confirmPassword
  )
})

async function handleSubmit() {
  errors.value = {}
  error.value = null

  // Validação
  if (form.value.newPassword.length < 6) {
    errors.value.newPassword = 'Senha deve ter pelo menos 6 caracteres'
    return
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Senhas não coincidem'
    return
  }

  loading.value = true
  try {
    const token = route.params.token as string
    await authApi.resetPassword({
      token,
      newPassword: form.value.newPassword,
      confirmPassword: form.value.confirmPassword,
    })
    
    success.value = true
    setTimeout(() => {
      router.push({ name: ROUTE_NAMES.LOGIN })
    }, 2000)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao redefinir senha'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.password-reset-confirm-view {
  width: 100%;
}

.password-reset-confirm-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.password-reset-confirm-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.password-reset-confirm-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-error {
  padding: 0.75rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  color: #991b1b;
  font-size: 0.875rem;
}

.form-success {
  padding: 0.75rem;
  background-color: #d1fae5;
  border: 1px solid #a7f3d0;
  border-radius: 0.375rem;
  color: #065f46;
  font-size: 0.875rem;
}

.form-submit {
  width: 100%;
  margin-top: 0.5rem;
}
</style>

