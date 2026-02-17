<template>
  <form @submit.prevent="handleSubmit" class="register-form">
    <Input
      v-model="form.name"
      label="Nome"
      placeholder="Seu nome completo"
      :error="errors.name"
      required
    />
    <Input
      v-model="form.email"
      type="email"
      label="Email"
      placeholder="seu@email.com"
      :error="errors.email"
      required
      autocomplete="email"
    />
    <Input
      v-model="form.password"
      type="password"
      label="Senha"
      placeholder="••••••••"
      :error="errors.password"
      required
      autocomplete="new-password"
    />
    <Input
      v-model="form.confirmPassword"
      type="password"
      label="Confirmar Senha"
      placeholder="••••••••"
      :error="errors.confirmPassword"
      required
      autocomplete="new-password"
    />
    
    <div v-if="error" class="form-error">
      {{ error }}
    </div>
    
    <Button
      type="submit"
      :loading="loading"
      :disabled="!isValid"
      class="form-submit"
    >
      Criar Conta
    </Button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import Input from '@/shared/components/ui/Input.vue'
import Button from '@/shared/components/ui/Button.vue'
import { isValidEmail } from '@/shared/utils/validators'
import type { RegisterCredentials } from '../types/auth.types'

const router = useRouter()
const authStore = useAuthStore()

const form = ref<RegisterCredentials>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = ref<Record<string, string>>({})
const error = computed(() => authStore.error)
const loading = computed(() => authStore.loading)

const isValid = computed(() => {
  return (
    form.value.name.length > 0 &&
    isValidEmail(form.value.email) &&
    form.value.password.length >= 6 &&
    form.value.password === form.value.confirmPassword
  )
})

async function handleSubmit() {
  errors.value = {}

  // Validação
  if (!form.value.name.trim()) {
    errors.value.name = 'Nome é obrigatório'
    return
  }

  if (!isValidEmail(form.value.email)) {
    errors.value.email = 'Email inválido'
    return
  }

  if (form.value.password.length < 6) {
    errors.value.password = 'Senha deve ter pelo menos 6 caracteres'
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Senhas não coincidem'
    return
  }

  try {
    await authStore.register({
      email: form.value.email,
      password: form.value.password,
      confirmPassword: form.value.confirmPassword,
      name: form.value.name,
    })
    
    router.push({ name: ROUTE_NAMES.COMPANY_SELECTION })
  } catch (err) {
    // Erro já está no store
  }
}
</script>

<style scoped>
.register-form {
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

.form-submit {
  width: 100%;
  margin-top: 0.5rem;
}
</style>

