<template>
  <div class="service-order-select">
    <label for="serviceOrderId" class="form-label">
      Ordem de Serviço
      <span v-if="required" class="form-required">*</span>
    </label>
    
    <div class="select-wrapper">
      <Input
        :model-value="searchQuery"
        @update:model-value="searchQuery = $event"
        type="text"
        placeholder="Buscar por ID ou descrição..."
        @input="handleSearch"
        @focus="showDropdown = true"
      />
      
      <div v-if="showDropdown && filteredOrders.length > 0" class="dropdown">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="dropdown-item"
          @click="selectOrder(order)"
        >
          <div class="order-info">
            <span class="order-id">#{{ order.id.slice(0, 8) }}</span>
            <span class="order-description">{{ order.description || 'Sem descrição' }}</span>
          </div>
          <span class="order-value">{{ formatMoney(order.value || 0) }}</span>
        </div>
      </div>
      
      <div v-if="showDropdown && searchQuery && filteredOrders.length === 0 && !loading" class="dropdown-empty">
        Nenhuma ordem encontrada
      </div>
    </div>

    <div v-if="selectedOrder" class="selected-order">
      <div class="selected-order-info">
        <span class="selected-order-id">Ordem #{{ selectedOrder.id.slice(0, 8) }}</span>
        <span class="selected-order-description">{{ selectedOrder.description || 'Sem descrição' }}</span>
        <span class="selected-order-value">{{ formatMoney(selectedOrder.value || 0) }}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        @click="clearSelection"
      >
        Remover
      </Button>
    </div>

    <small v-if="!selectedOrder" class="form-hint">
      Deixe em branco se não estiver associada a uma ordem
    </small>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useCompanyStore } from '@/shared/stores/company.store'
import { serviceOrderApi } from '@/shared/api/service-order.api'
import type { ServiceOrder } from '@/modules/service-orders/types/service-order.types'
import Input from '@/shared/components/ui/Input.vue'
import Button from '@/shared/components/ui/Button.vue'
import { formatMoney } from '@/shared/utils/money'
import { debounce } from '@/shared/utils/debounce'

interface Props {
  modelValue?: string | null
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const companyStore = useCompanyStore()
const searchQuery = ref('')
const showDropdown = ref(false)
const orders = ref<ServiceOrder[]>([])
const loading = ref(false)
const selectedOrder = ref<ServiceOrder | null>(null)

const filteredOrders = computed(() => {
  if (!searchQuery.value) return []
  
  const query = searchQuery.value.toLowerCase()
  return orders.value.filter(order => {
    const idMatch = order.id.toLowerCase().includes(query)
    const descMatch = order.description?.toLowerCase().includes(query)
    return idMatch || descMatch
  }).slice(0, 10) // Limitar a 10 resultados
})

async function loadOrders() {
  if (!companyStore.currentCompany?.id) return

  loading.value = true
  try {
    const response = await serviceOrderApi.list(
      companyStore.currentCompany.id,
      1,
      50 // Carregar mais ordens para busca
    )
    orders.value = response.data.data
  } catch (err) {
    console.error('Erro ao carregar ordens:', err)
    orders.value = []
  } finally {
    loading.value = false
  }
}

const handleSearch = debounce(() => {
  if (searchQuery.value && orders.value.length === 0) {
    loadOrders()
  }
}, 300)

function selectOrder(order: ServiceOrder) {
  selectedOrder.value = order
  emit('update:modelValue', order.id)
  showDropdown.value = false
  searchQuery.value = ''
}

function clearSelection() {
  selectedOrder.value = null
  emit('update:modelValue', null)
  searchQuery.value = ''
}

// Carregar ordem selecionada se modelValue já tiver valor
watch(
  () => props.modelValue,
  async (newValue) => {
    if (newValue && !selectedOrder.value) {
      // Tentar encontrar a ordem na lista
      if (orders.value.length === 0) {
        await loadOrders()
      }
      const order = orders.value.find(o => o.id === newValue)
      if (order) {
        selectedOrder.value = order
        searchQuery.value = `#${order.id.slice(0, 8)}`
      }
    } else if (!newValue) {
      selectedOrder.value = null
      searchQuery.value = ''
    }
  },
  { immediate: true }
)

// Fechar dropdown ao clicar fora
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.service-order-select')) {
      showDropdown.value = false
    }
  })
  
  if (companyStore.currentCompany?.id) {
    loadOrders()
  }
})
</script>

<style scoped>
.service-order-select {
  position: relative;
}

.select-wrapper {
  position: relative;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.25rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: var(--color-background-secondary);
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.order-id {
  font-weight: 600;
  color: var(--color-primary);
  font-size: 0.875rem;
}

.order-description {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-value {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.875rem;
}

.dropdown-empty {
  padding: 1rem;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.selected-order {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-order-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.selected-order-id {
  font-weight: 600;
  color: var(--color-primary);
  font-size: 0.875rem;
}

.selected-order-description {
  color: var(--color-text-primary);
  font-size: 0.9rem;
}

.selected-order-value {
  font-weight: 600;
  color: var(--color-success);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>

