<template>
  <div class="service-order-actions">
    <Button
      v-if="canStart"
      variant="primary"
      size="sm"
      :loading="loading"
      @click="$emit('start')"
    >
      Iniciar
    </Button>
    <Button
      v-if="canComplete"
      variant="success"
      size="sm"
      :loading="loading"
      @click="$emit('complete')"
    >
      Finalizar
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
import type { ServiceOrder, ServiceOrderStatus } from '../types/service-order.types'
import Button from '@/shared/components/ui/Button.vue'

interface Props {
  order: ServiceOrder
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const status = computed(() => props.order.status)

const canStart = computed(() => {
  return status.value === 'CREATED'
})

const canComplete = computed(() => {
  return ['STARTED', 'IN_PROGRESS'].includes(status.value)
})

const canCancel = computed(() => {
  return ['CREATED', 'STARTED', 'IN_PROGRESS', 'PAUSED'].includes(status.value)
})

const canEdit = computed(() => {
  return status.value === 'CREATED'
})

defineEmits<{
  start: []
  complete: []
  cancel: []
  edit: []
}>()
</script>

<style scoped>
.service-order-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>


