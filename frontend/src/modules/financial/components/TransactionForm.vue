<template>
  <form @submit.prevent="handleSubmit" class="transaction-form">
    <div class="form-row">
      <div class="form-group">
        <label for="type" class="form-label">
          Tipo
          <span class="form-required">*</span>
        </label>
        <select id="type" v-model="form.type" required>
          <option
            v-for="option in transactionTypeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <Input
        v-model.number="form.amount"
        type="number"
        label="Valor (R$)"
        placeholder="0.00"
        :error="errors.amount"
        required
        step="0.01"
        min="0.01"
      />
    </div>

    <div class="form-group">
      <label for="description" class="form-label">
        Descrição
        <span class="form-required">*</span>
      </label>
      <Input
        v-model="form.description"
        multiline
        :rows="3"
        placeholder="Descreva a transação"
        :error="errors.description"
        required
      />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="paymentMethod">Método de Pagamento</label>
        <select id="paymentMethod" v-model="form.paymentMethod">
          <option :value="null">Selecione...</option>
          <option
            v-for="option in paymentMethodOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <Input
        :model-value="form.dueDate || ''"
        @update:model-value="form.dueDate = $event || null"
        type="date"
        label="Data de Vencimento"
        :error="errors.dueDate"
      />
    </div>

    <div class="form-group">
      <ServiceOrderSelect
        v-model="form.serviceOrderId"
        :required="false"
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
        {{ transaction ? 'Atualizar' : 'Criar' }} Transação
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useTransactionForm } from '../composables/useTransactionForm'
import { useFinancial } from '../composables/useFinancial'
import Input from '@/shared/components/ui/Input.vue'
import Button from '@/shared/components/ui/Button.vue'
import ServiceOrderSelect from './ServiceOrderSelect.vue'
import {
  TRANSACTION_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from '@/shared/constants/enums'
import type { Transaction } from '../types/financial.types'

interface Props {
  transaction?: Transaction
  serviceOrderId?: string
  initialAmount?: number
}

const props = withDefaults(defineProps<Props>(), {
  serviceOrderId: undefined,
  initialAmount: undefined,
})

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

const { form, errors, isValid, validate, reset } = useTransactionForm()
const { createTransaction, updateTransaction, loading, error } = useFinancial()

const transactionTypeOptions = TRANSACTION_TYPE_OPTIONS
const paymentMethodOptions = PAYMENT_METHOD_OPTIONS

watch(
  () => props.transaction,
  (newTransaction) => {
    if (newTransaction) {
      form.value = {
        companyId: newTransaction.companyId,
        serviceOrderId: newTransaction.serviceOrderId || null,
        type: newTransaction.type,
        amount: newTransaction.amount,
        currency: newTransaction.currency,
        description: newTransaction.description,
        paymentMethod: newTransaction.paymentMethod || null,
        dueDate: newTransaction.dueDate || null,
      }
    } else if (props.serviceOrderId || props.initialAmount) {
      // Inicializar com valores padrão quando criando a partir de uma ordem
      form.value = {
        ...form.value,
        serviceOrderId: props.serviceOrderId || null,
        type: 'INCOME', // Por padrão, receita quando criada a partir de ordem
        amount: props.initialAmount || form.value.amount,
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
    if (props.transaction) {
      await updateTransaction(props.transaction.id, {
        amount: form.value.amount,
        description: form.value.description,
        paymentMethod: form.value.paymentMethod,
        dueDate: form.value.dueDate,
        serviceOrderId: form.value.serviceOrderId || undefined,
      })
    } else {
      await createTransaction(form.value)
    }
    reset()
    emit('submit')
  } catch (err: any) {
    // Erro já está no store
    // Não logar erros esperados (404) - são tratados silenciosamente
    if (error.value && !err.isExpected404 && !err.isEndpointNotFound && err.response?.status !== 404) {
      console.error('Erro ao salvar transação:', error.value)
    }
  }
}

function handleCancel() {
  reset()
  emit('cancel')
}
</script>

<style scoped>
.transaction-form {
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

.form-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}
</style>

