import { ref, computed } from 'vue'
import { useCompanyStore } from '@/shared/stores/company.store'
import type { CreateServiceOrderDto, Priority } from '../types/service-order.types'
import { isValidEmail } from '@/shared/utils/validators'

/**
 * Composable para gerenciar formulário de Service Order
 */
export function useServiceOrderForm() {
  const companyStore = useCompanyStore()

  const form = ref<CreateServiceOrderDto>({
    companyId: companyStore.companyId || '',
    description: '',
    priority: 'MEDIUM',
    value: 0,
  })

  const errors = ref<Record<string, string>>({})

  const isValid = computed(() => {
    return (
      form.value.companyId.length > 0 &&
      form.value.description.trim().length >= 10 &&
      form.value.priority.length > 0 &&
      form.value.value >= 0
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

    if (form.value.value < 0) {
      errors.value.value = 'Valor não pode ser negativo'
      return false
    }

    return true
  }

  function reset() {
    form.value = {
      companyId: companyStore.companyId || '',
      description: '',
      priority: 'MEDIUM',
      value: 0,
    }
    errors.value = {}
  }

  function setPriority(priority: Priority) {
    form.value.priority = priority
  }

  return {
    form,
    errors,
    isValid,
    validate,
    reset,
    setPriority,
  }
}


