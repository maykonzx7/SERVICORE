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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '@/shared/stores/company.store'

const router = useRouter()
const companyStore = useCompanyStore()

const selectedCompanyId = ref<string | null>(companyStore.companyId)
const companies = computed(() => companyStore.companies)

onMounted(async () => {
  if (companies.value.length === 0) {
    await companyStore.loadCompanies()
  }
  selectedCompanyId.value = companyStore.companyId
})

async function handleCompanyChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const company = companyStore.companies.find((c) => c.id === target.value)
  
  if (company) {
    companyStore.setCurrentCompany(company)
    selectedCompanyId.value = company.id
    // Recarregar página para atualizar dados
    router.go(0)
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

