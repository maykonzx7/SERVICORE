<template>
  <div class="service-order-filters">
    <div class="filters-row">
      <Input
        v-model="searchQuery"
        label="Buscar"
        placeholder="Buscar por descrição..."
        @input="handleSearch"
      />
      <select v-model="selectedStatus" @change="handleStatusChange" class="filter-select">
        <option value="">Todos os Status</option>
        <option
          v-for="status in statusOptions"
          :key="status.value"
          :value="status.value"
        >
          {{ status.label }}
        </option>
      </select>
      <select v-model="selectedPriority" @change="handlePriorityChange" class="filter-select">
        <option value="">Todas as Prioridades</option>
        <option
          v-for="priority in priorityOptions"
          :key="priority.value"
          :value="priority.value"
        >
          {{ priority.label }}
        </option>
      </select>
      <Button variant="outline" size="sm" @click="handleClearFilters">
        Limpar
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useServiceOrderFilters } from '../composables/useServiceOrderFilters'
import Input from '@/shared/components/ui/Input.vue'
import Button from '@/shared/components/ui/Button.vue'
import { SERVICE_ORDER_STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/shared/constants/enums'
// Debounce function (se lodash não estiver disponível)

const { filters, setStatus, setPriority, setSearch, clearFilters } = useServiceOrderFilters()

const searchQuery = ref('')
const selectedStatus = ref('')
const selectedPriority = ref('')

const statusOptions = SERVICE_ORDER_STATUS_OPTIONS
const priorityOptions = PRIORITY_OPTIONS

// Debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

const debouncedSearch = debounce((query: string) => {
  setSearch(query || undefined)
  emit('filter', filters.value)
}, 300)

function handleSearch() {
  debouncedSearch(searchQuery.value)
}

function handleStatusChange() {
  setStatus(selectedStatus.value || undefined)
  emit('filter', filters.value)
}

function handlePriorityChange() {
  setPriority(selectedPriority.value || undefined)
  emit('filter', filters.value)
}

function handleClearFilters() {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedPriority.value = ''
  clearFilters()
  emit('filter', filters.value)
}

const emit = defineEmits<{
  filter: [filters: typeof filters.value]
}>()
</script>


<style scoped>
.service-order-filters {
  margin-bottom: 1.5rem;
}

.filters-row {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.filters-row > :first-child {
  flex: 1;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  min-width: 10rem;
}
</style>

