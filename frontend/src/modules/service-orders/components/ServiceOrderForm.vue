<template>
  <form @submit.prevent="handleSubmit" class="service-order-form">
    <div class="form-group">
      <label for="description" class="form-label">
        Descrição
        <span class="form-required">*</span>
      </label>
      <textarea
        id="description"
        v-model="form.description"
        placeholder="Descreva a ordem de serviço"
        :class="['form-textarea', { 'form-error': errors.description }]"
        rows="4"
        required
      />
      <span v-if="errors.description" class="form-error-message">
        {{ errors.description }}
      </span>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label for="priority">Prioridade</label>
        <select id="priority" v-model="form.priority" required>
          <option
            v-for="option in priorityOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
      
      <Input
        v-model.number="form.value"
        type="number"
        label="Valor (R$)"
        placeholder="0.00"
        :error="errors.value"
        required
        step="0.01"
        min="0"
      />
    </div>

    <div v-if="error" class="form-error">
      {{ error }}
    </div>

    <div class="form-actions">
      <Button
        type="button"
        variant="outline"
        @click="handleCancel"
        :disabled="loading"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        :loading="loading"
        :disabled="!isValid"
      >
        {{ order ? 'Atualizar' : 'Criar' }} Ordem de Serviço
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useServiceOrderForm } from '../composables/useServiceOrderForm'
import { useServiceOrder } from '../composables/useServiceOrder'
import Input from '@/shared/components/ui/Input.vue'
import Button from '@/shared/components/ui/Button.vue'
import { PRIORITY_OPTIONS } from '@/shared/constants/enums'
import type { ServiceOrder } from '../types/service-order.types'

interface Props {
  order?: ServiceOrder
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

const { form, errors, isValid, validate, reset } = useServiceOrderForm()
const { createOrder, updateOrder, loading, error } = useServiceOrder()

const priorityOptions = PRIORITY_OPTIONS

watch(
  () => props.order,
  (newOrder) => {
    if (newOrder) {
      form.value = {
        companyId: newOrder.companyId,
        description: newOrder.description,
        priority: newOrder.priority,
        value: newOrder.value,
      }
    }
  },
  { immediate: true }
)

async function handleSubmit() {
  if (!validate()) {
    return
  }

  try {
    if (props.order) {
      await updateOrder(props.order.id, {
        description: form.value.description,
        priority: form.value.priority,
        value: form.value.value,
      })
    } else {
      await createOrder(form.value)
    }
    reset()
    emit('submit')
  } catch (err) {
    // Erro já está no store
  }
}

function handleCancel() {
  reset()
  emit('cancel')
}
</script>

<style scoped>
.service-order-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-required {
  color: #ef4444;
}

.form-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 4rem;
  transition: all 0.2s;
}

.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea.form-error {
  border-color: #ef4444;
}

.form-error-message {
  font-size: 0.875rem;
  color: #ef4444;
}

.form-group select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  background: white;
  transition: all 0.2s;
}

.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

