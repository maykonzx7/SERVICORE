<template>
  <div class="table-wrapper">
    <table class="table">
      <thead v-if="headers.length > 0">
        <tr>
          <th v-for="header in headers" :key="header.key" :class="header.class">
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="headers.length" class="table-loading">
            Carregando...
          </td>
        </tr>
        <tr v-else-if="items.length === 0">
          <td :colspan="headers.length" class="table-empty">
            Nenhum item encontrado
          </td>
        </tr>
        <tr v-else v-for="(item, index) in items" :key="getItemKey(item, index)" @click="$emit('rowClick', item)">
          <td v-for="header in headers" :key="header.key" :class="header.class">
            <slot :name="`cell-${header.key}`" :item="item" :value="item[header.key]">
              {{ formatValue(item[header.key], header.format) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface TableHeader {
  key: string
  label: string
  class?: string
  format?: 'text' | 'date' | 'money' | 'number'
}

interface Props {
  headers: TableHeader[]
  items: Record<string, any>[]
  loading?: boolean
  itemKey?: string | ((item: any) => string)
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  itemKey: 'id',
})

defineEmits<{
  rowClick: [item: any]
}>()

function getItemKey(item: any, index: number): string {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item)
  }
  return item[props.itemKey] || `row-${index}`
}

function formatValue(value: any, format?: string): string {
  if (value === null || value === undefined) return '-'
  
  switch (format) {
    case 'date':
      return new Date(value).toLocaleDateString('pt-BR')
    case 'money':
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value)
    case 'number':
      return new Intl.NumberFormat('pt-BR').format(value)
    default:
      return String(value)
  }
}
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.table thead {
  background-color: #f9fafb;
}

.table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #111827;
}

.table tbody tr {
  transition: background-color 0.2s;
}

.table tbody tr:hover {
  background-color: #f9fafb;
  cursor: pointer;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table-loading,
.table-empty {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}
</style>

