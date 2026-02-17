import { ref, computed } from 'vue'
import { useCompanyStore } from '@/shared/stores/company.store'
import type { CreateTransactionDto, TransactionType, PaymentMethod } from '../types/financial.types'

/**
 * Composable para gerenciar formulário de Transaction
 */
export function useTransactionForm() {
  const companyStore = useCompanyStore()

  const form = ref<CreateTransactionDto>({
    companyId: companyStore.companyId || '',
    serviceOrderId: null,
    type: 'INCOME',
    amount: 0,
    currency: 'BRL',
    description: '',
    paymentMethod: null,
    dueDate: null,
  })

  const errors = ref<Record<string, string>>({})

  const isValid = computed(() => {
    return (
      form.value.companyId.length > 0 &&
      form.value.description.trim().length >= 10 &&
      form.value.amount > 0 &&
      form.value.type.length > 0
    )
  })

  function validate(): boolean {
    errors.value = {}

    if (!form.value.companyId) {
      errors.value.companyId = 'Empresa é obrigatória'
      return false
    }

    if (form.value.description.trim().length < 10) {
      errors.value.description = 'Descrição deve ter pelo menos 10 caracteres'
      return false
    }

    if (form.value.amount <= 0) {
      errors.value.amount = 'Valor deve ser maior que zero'
      return false
    }

    if (!form.value.type) {
      errors.value.type = 'Tipo de transação é obrigatório'
      return false
    }

    return true
  }

  function reset() {
    form.value = {
      companyId: companyStore.companyId || '',
      serviceOrderId: null,
      type: 'INCOME',
      amount: 0,
      currency: 'BRL',
      description: '',
      paymentMethod: null,
      dueDate: null,
    }
    errors.value = {}
  }

  function setType(type: TransactionType) {
    form.value.type = type
  }

  function setPaymentMethod(method: PaymentMethod | null) {
    form.value.paymentMethod = method
  }

  return {
    form,
    errors,
    isValid,
    validate,
    reset,
    setType,
    setPaymentMethod,
  }
}

