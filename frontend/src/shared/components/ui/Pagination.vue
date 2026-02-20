<template>
  <div class="pagination">
    <Button
      variant="outline"
      size="sm"
      :disabled="currentPage === 1 || loading"
      @click="$emit('page-change', currentPage - 1)"
    >
      Anterior
    </Button>
    
    <div class="pagination-info">
      <span v-if="totalItems > 0">
        Página {{ currentPage }} de {{ totalPages }}
        <span class="pagination-total">({{ totalItems }} total)</span>
      </span>
      <span v-else>Nenhum resultado</span>
    </div>
    
    <Button
      variant="outline"
      size="sm"
      :disabled="currentPage === totalPages || loading || totalPages === 0"
      @click="$emit('page-change', currentPage + 1)"
    >
      Próxima
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from './Button.vue'

interface Props {
  currentPage: number
  totalPages: number
  totalItems: number
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

defineEmits<{
  'page-change': [page: number]
}>()
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-total {
  color: #9ca3af;
}
</style>

