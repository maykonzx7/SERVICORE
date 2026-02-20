<template>
  <div class="company-switcher">
    <select
      :value="selectedCompanyId"
      @change="handleCompanyChange"
      class="company-select"
    >
      <option v-for="company in companies" :key="company.id" :value="company.id">
        {{ company.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCompanyStore } from '@/shared/stores/company.store'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const router = useRouter()
const route = useRoute()
const companyStore = useCompanyStore()

const selectedCompanyId = ref<string | null>(companyStore.companyId)
const companies = computed(() => {
  const companiesValue = companyStore.companies
  // Garantir que sempre retorna um array
  return Array.isArray(companiesValue) ? companiesValue : []
})

// Atualizar selectedCompanyId quando o companyId mudar no store
watch(() => companyStore.companyId, (newId) => {
  selectedCompanyId.value = newId
}, { immediate: true })

onMounted(async () => {
  if (companies.value.length === 0) {
    await companyStore.loadCompanies()
  }
  selectedCompanyId.value = companyStore.companyId
})

async function handleCompanyChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const selectedId = target.value
  
  if (!selectedId || selectedId === 'undefined' || selectedId === 'null') {
    console.warn('ID de empresa inválido:', selectedId)
    return
  }
  
  // Garantir que companies é um array
  const companiesArray = Array.isArray(companyStore.companies) 
    ? companyStore.companies 
    : []
  
  const company = companiesArray.find((c) => c.id === selectedId)
  
  if (company) {
    console.log('Trocando empresa para:', company.name, company.id)
    
    // Atualizar empresa no store
    companyStore.setCurrentCompany(company)
    selectedCompanyId.value = company.id
    
    // Se estiver na tela de seleção de empresa, ir para o dashboard
    if (route.name === ROUTE_NAMES.COMPANY_SELECTION) {
      router.push({ name: ROUTE_NAMES.DASHBOARD })
    } else {
      // Recarregar a página para garantir que todos os componentes sejam atualizados
      // com a nova empresa selecionada
      window.location.reload()
    }
  } else {
    console.warn('Empresa não encontrada com ID:', selectedId)
  }
}
</script>

<style scoped>
.company-switcher {
  display: flex;
  align-items: center;
}

.company-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
}
</style>

