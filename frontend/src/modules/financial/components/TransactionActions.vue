<template>
  <div class="transaction-actions">
    <Button
      v-if="canApprove"
      variant="success"
      size="sm"
      :loading="loading"
      @click="$emit('approve')"
    >
      Aprovar
    </Button>
    <Button
      v-if="canReject"
      variant="danger"
      size="sm"
      :loading="loading"
      @click="$emit('reject')"
    >
      Rejeitar
    </Button>
    <Button
      v-if="canProcess"
      variant="primary"
      size="sm"
      :loading="loading"
      @click="$emit('process')"
    >
      Processar
    </Button>
    <Button
      v-if="canCancel"
      variant="danger"
      size="sm"
      :loading="loading"
      @click="$emit('cancel')"
    >
      Cancelar
    </Button>
    <Button
      v-if="canEdit"
      variant="outline"
      size="sm"
      @click="$emit('edit')"
    >
      Editar
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Transaction, TransactionStatus } from '../types/financial.types'
import Button from '@/shared/components/ui/Button.vue'

interface Props {
  transaction: Transaction
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const status = computed(() => props.transaction.status)

const canApprove = computed(() => {
  return status.value === 'PENDING'
})

const canReject = computed(() => {
  return status.value === 'PENDING'
})

const canProcess = computed(() => {
  return status.value === 'APPROVED'
})

const canCancel = computed(() => {
  return ['PENDING', 'APPROVED'].includes(status.value)
})

const canEdit = computed(() => {
  return status.value === 'PENDING'
})

defineEmits<{
  approve: []
  reject: []
  process: []
  cancel: []
  edit: []
}>()
</script>

<style scoped>
.transaction-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>

