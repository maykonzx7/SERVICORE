<template>
  <form @submit.prevent="handleSubmit" class="register-form">
    <Input
      v-model="form.companyName"
      label="Nome da Empresa"
      placeholder="Nome da sua empresa"
      :error="errors.companyName"
      required
    />
    <Input
      v-model="form.name"
      label="Seu Nome"
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
    <Input
      v-model="form.phone"
      type="tel"
      label="Telefone"
      placeholder="(11) 98765-4321"
      :error="errors.phone"
    />
    <Input
      v-model="form.cnpj"
      label="CNPJ (opcional)"
      placeholder="00.000.000/0000-00"
      :error="errors.cnpj"
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
import { useCompanyStore } from '@/shared/stores/company.store'
import { organizationApi } from '@/modules/organization/api/organization.api'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import Input from '@/shared/components/ui/Input.vue'
import Button from '@/shared/components/ui/Button.vue'
import { isValidEmail, isValidCNPJ } from '@/shared/utils/validators'
import type { RegisterCredentials } from '../types/auth.types'

const router = useRouter()
const authStore = useAuthStore()
const companyStore = useCompanyStore()

interface RegisterFormData extends RegisterCredentials {
  companyName: string
  cnpj?: string
  phone?: string
}

const form = ref<RegisterFormData>({
  companyName: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  cnpj: '',
})

const errors = ref<Record<string, string>>({})
const error = ref<string | null>(null)
const loading = ref(false)

const isValid = computed(() => {
  return (
    form.value.name.length > 0 &&
    isValidEmail(form.value.email) &&
    form.value.password.length >= 6 &&
    form.value.password === form.value.confirmPassword &&
    form.value.companyName.length > 0
  )
})

async function handleSubmit() {
  errors.value = {}
  error.value = null
  
  // Validação - Dados Pessoais
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

  // Validação - Dados da Empresa
  if (!form.value.companyName.trim()) {
    errors.value.companyName = 'Nome da empresa é obrigatório'
    return
  }

  if (form.value.cnpj && !isValidCNPJ(form.value.cnpj)) {
    errors.value.cnpj = 'CNPJ inválido'
    return
  }


  loading.value = true
  try {
    // 1. Registrar usuário
    await authStore.register({
      email: form.value.email,
      password: form.value.password,
      name: form.value.name,
    })
    
    // 2. Criar empresa automaticamente (usando email do usuário como email da empresa)
    const companyData = {
      name: form.value.companyName,
      cnpj: form.value.cnpj || undefined,
      email: form.value.email, // Usa o mesmo email do usuário
      phone: form.value.phone || undefined,
    }
    
    const companyResponse = await organizationApi.createCompany(companyData)
    const newCompany = companyResponse.data
    
    if (!newCompany) {
      throw new Error('Erro ao criar empresa')
    }
    
    // 3. Selecionar empresa automaticamente
    companyStore.setCurrentCompany(newCompany)
    
    // 4. Redirecionar para dashboard
    router.push({ name: ROUTE_NAMES.DASHBOARD })
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Erro ao criar conta'
    console.error('Erro no registro:', err)
  } finally {
    loading.value = false
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

