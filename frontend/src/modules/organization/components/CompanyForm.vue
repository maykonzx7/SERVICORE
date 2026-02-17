<template>
  <form @submit.prevent="handleSubmit" class="company-form">
    <Input
      v-model="form.name"
      label="Nome da Empresa"
      placeholder="Nome da empresa"
      :error="errors.name"
      required
    />
    <Input
      v-model="form.cnpj"
      label="CNPJ"
      placeholder="00.000.000/0000-00"
      :error="errors.cnpj"
    />
    <Input
      v-model="form.email"
      type="email"
      label="Email"
      placeholder="contato@empresa.com"
      :error="errors.email"
    />
    <Input
      v-model="form.phone"
      type="tel"
      label="Telefone"
      placeholder="(11) 98765-4321"
      :error="errors.phone"
    />
    
    <div v-if="error" class="form-error">
      {{ error }}
    </div>
    
    <div class="form-actions">
      <Button
        type="button"
        variant="outline"
        @click="$emit('cancel')"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        :loading="loading"
        :disabled="!isValid"
      >
        {{ company ? 'Atualizar' : 'Criar' }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { organizationApi } from '../api/organization.api'
import Input from '@/shared/components/ui/Input.vue'
import Button from '@/shared/components/ui/Button.vue'
import type { Company, CreateCompanyDto, UpdateCompanyDto } from '../types/organization.types'
import { isValidEmail, isValidCNPJ } from '@/shared/utils/validators'

interface Props {
  company?: Company
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: CreateCompanyDto | UpdateCompanyDto]
  cancel: []
}>()

const form = ref<CreateCompanyDto>({
  name: props.company?.name || '',
  cnpj: props.company?.cnpj || '',
  email: props.company?.email || '',
  phone: props.company?.phone || '',
})

const errors = ref<Record<string, string>>({})
const error = ref<string | null>(null)
const loading = ref(false)

const isValid = computed(() => {
  return form.value.name.length > 0
})

watch(() => props.company, (newCompany) => {
  if (newCompany) {
    form.value = {
      name: newCompany.name,
      cnpj: newCompany.cnpj || '',
      email: newCompany.email || '',
      phone: newCompany.phone || '',
    }
  }
}, { immediate: true })

async function handleSubmit() {
  errors.value = {}
  error.value = null

  // Validação
  if (!form.value.name.trim()) {
    errors.value.name = 'Nome é obrigatório'
    return
  }

  if (form.value.email && !isValidEmail(form.value.email)) {
    errors.value.email = 'Email inválido'
    return
  }

  if (form.value.cnpj && !isValidCNPJ(form.value.cnpj)) {
    errors.value.cnpj = 'CNPJ inválido'
    return
  }

  loading.value = true
  try {
    emit('submit', form.value)
  } catch (err: any) {
    error.value = err.message || 'Erro ao salvar empresa'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.company-form {
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>

