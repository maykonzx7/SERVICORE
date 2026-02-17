<template>
  <AuthLayout>
    <div class="password-reset-view">
      <h2 class="password-reset-title">Recuperar Senha</h2>
      <p class="password-reset-subtitle">
        Digite seu email para receber instruções de recuperação de senha
      </p>
      <form @submit.prevent="handleSubmit" class="password-reset-form">
        <Input
          v-model="email"
          type="email"
          label="Email"
          placeholder="seu@email.com"
          :error="error"
          required
        />
        <Button
          type="submit"
          :loading="loading"
          :disabled="!isValidEmail(email)"
          class="form-submit"
        >
          Enviar Instruções
        </Button>
      </form>
      <div class="password-reset-footer">
        <router-link :to="{ name: ROUTE_NAMES.LOGIN }" class="password-reset-link">
          Voltar para login
        </router-link>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { authApi } from '../api/auth.api'
import AuthLayout from '@/shared/layouts/AuthLayout.vue'
import Input from '@/shared/components/ui/Input.vue'
import Button from '@/shared/components/ui/Button.vue'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import { isValidEmail } from '@/shared/utils/validators'

const email = ref('')
const error = ref<string | null>(null)
const loading = ref(false)
const success = ref(false)

async function handleSubmit() {
  error.value = null

  if (!isValidEmail(email.value)) {
    error.value = 'Email inválido'
    return
  }

  loading.value = true
  try {
    await authApi.requestPasswordReset({ email: email.value })
    success.value = true
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao enviar email de recuperação'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.password-reset-view {
  width: 100%;
}

.password-reset-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.password-reset-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.password-reset-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-submit {
  width: 100%;
  margin-top: 0.5rem;
}

.password-reset-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.password-reset-link {
  font-size: 0.875rem;
  color: #3b82f6;
  text-decoration: none;
}

.password-reset-link:hover {
  text-decoration: underline;
}
</style>

