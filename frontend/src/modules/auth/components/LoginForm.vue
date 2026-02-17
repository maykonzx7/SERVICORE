<template>
  <form @submit.prevent="handleSubmit" class="login-form">
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
      autocomplete="current-password"
    />
    <div class="login-form-footer">
      <router-link :to="{ name: ROUTE_NAMES.PASSWORD_RESET }" class="login-form-link">
        Esqueceu sua senha?
      </router-link>
    </div>
    <div v-if="error" class="form-error">
      {{ error }}
    </div>
    <Button
      type="submit"
      :loading="loading"
      :disabled="!isValid"
      class="form-submit"
    >
      Entrar
    </Button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import Input from '@/shared/components/ui/Input.vue'
import Button from '@/shared/components/ui/Button.vue'
import { isValidEmail } from '@/shared/utils/validators'

const { login, loading, error } = useAuth()

const form = ref({
  email: '',
  password: '',
})

const errors = ref<Record<string, string>>({})

const isValid = computed(() => {
  return (
    isValidEmail(form.value.email) &&
    form.value.password.length >= 6
  )
})

async function handleSubmit() {
  errors.value = {}

  // Validação
  if (!isValidEmail(form.value.email)) {
    errors.value.email = 'Email inválido'
    return
  }

  if (form.value.password.length < 6) {
    errors.value.password = 'Senha deve ter pelo menos 6 caracteres'
    return
  }

  try {
    await login({
      email: form.value.email,
      password: form.value.password,
    })
  } catch (err) {
    // Erro já está no store
  }
}
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-form-footer {
  display: flex;
  justify-content: flex-end;
}

.login-form-link {
  font-size: 0.875rem;
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s;
}

.login-form-link:hover {
  color: #2563eb;
  text-decoration: underline;
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

