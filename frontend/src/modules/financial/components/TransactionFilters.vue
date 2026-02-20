<template>
  <div class="transaction-filters">
    <div class="filters-row">
      <Input
        v-model="searchQuery"
        label="Buscar"
        placeholder="Buscar por descrição..."
        @input="handleSearch"
      />
      <select v-model="selectedType" @change="handleTypeChange" class="filter-select">
        <option value="">Todos os Tipos</option>
        <option
          v-for="type in typeOptions"
          :key="type.value"
          :value="type.value"
        >
          {{ type.label }}
        </option>
      </select>
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
      <select v-model="selectedPaymentMethod" @change="handlePaymentMethodChange" class="filter-select">
        <option value="">Todos os Métodos</option>
        <option
          v-for="method in paymentMethodOptions"
          :key="method.value"
          :value="method.value"
        >
          {{ method.label }}
        </option>
      </select>
      <Input
        v-model="startDate"
        type="date"
        label="Data Início"
        @input="handleDateChange"
        class="filter-date"
      />
      <Input
        v-model="endDate"
        type="date"
        label="Data Fim"
        @input="handleDateChange"
        class="filter-date"
      />
      <Button variant="outline" size="sm" @click="handleClearFilters">
        Limpar
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTransactionFilters } from '../composables/useTransactionFilters'
import Input from '@/shared/components/ui/Input.vue'
import Button from '@/shared/components/ui/Button.vue'
import {
  TRANSACTION_TYPE_OPTIONS,
  TRANSACTION_STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from '@/shared/constants/enums'

const { filters, setType, setStatus, setPaymentMethod, setSearch, setStartDate, setEndDate, clearFilters } = useTransactionFilters()

const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
const selectedPaymentMethod = ref('')
const startDate = ref('')
const endDate = ref('')

const typeOptions = TRANSACTION_TYPE_OPTIONS
const statusOptions = TRANSACTION_STATUS_OPTIONS
const paymentMethodOptions = PAYMENT_METHOD_OPTIONS

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

function handleTypeChange() {
  setType(selectedType.value || undefined)
  emit('filter', filters.value)
}

function handleStatusChange() {
  setStatus(selectedStatus.value || undefined)
  emit('filter', filters.value)
}

function handlePaymentMethodChange() {
  setPaymentMethod(selectedPaymentMethod.value || undefined)
  emit('filter', filters.value)
}

function handleDateChange() {
  setStartDate(startDate.value || undefined)
  setEndDate(endDate.value || undefined)
  emit('filter', filters.value)
}

function handleClearFilters() {
  searchQuery.value = ''
  selectedType.value = ''
  selectedStatus.value = ''
  selectedPaymentMethod.value = ''
  startDate.value = ''
  endDate.value = ''
  clearFilters()
  emit('filter', filters.value)
}

const emit = defineEmits<{
  filter: [filters: typeof filters.value]
}>()
</script>

<style scoped>
.transaction-filters {
  margin-bottom: 1.5rem;
}

.filters-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-select {
  min-width: 150px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-date {
  min-width: 150px;
}
</style>

