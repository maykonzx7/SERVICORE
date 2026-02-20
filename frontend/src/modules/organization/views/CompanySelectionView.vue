<template>
  <DashboardLayout>
    <div class="company-selection">
      <h1 class="company-selection-title">Selecione uma Empresa</h1>
      <p class="company-selection-subtitle">
        Você tem acesso a múltiplas empresas. Escolha qual deseja gerenciar agora.
      </p>
      
      <div v-if="loading" class="company-selection-loading">
        Carregando empresas...
      </div>
      
      <div v-else-if="companies.length === 0" class="company-selection-empty">
        <p>Nenhuma empresa encontrada.</p>
        <p>Você pode criar sua primeira empresa agora mesmo.</p>
        <Button @click="showCreateModal = true" variant="primary">
          Criar Primeira Empresa
        </Button>
      </div>
      
      <div v-else class="company-list-container">
        <div class="company-list-header">
          <h2>Suas Empresas</h2>
          <Button @click="showCreateModal = true" variant="primary">
            + Nova Empresa
          </Button>
        </div>
        <div class="company-list">
          <div
            v-for="company in companies"
            :key="company.id"
            class="company-card"
            :class="{ 'company-card-selected': selectedCompanyId === company.id }"
            @click="selectCompany(company)"
          >
            <h3 class="company-card-name">{{ company.name }}</h3>
            <p v-if="company.cnpj" class="company-card-cnpj">
              CNPJ: {{ formatCNPJ(company.cnpj) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Modal de criação de empresa -->
      <Modal v-model="showCreateModal" title="Criar Nova Empresa" @close="showCreateModal = false">
        <CompanyForm
          @submit="handleCompanyCreated"
          @cancel="showCreateModal = false"
        />
      </Modal>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '@/shared/stores/company.store'
import { organizationApi } from '../api/organization.api'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import Button from '@/shared/components/ui/Button.vue'
import CompanyForm from '../components/CompanyForm.vue'
import type { Company } from '@/shared/types/domain.types'
import { formatCNPJ } from '@/shared/utils/formatters'

const router = useRouter()
const companyStore = useCompanyStore()

const companies = computed(() => companyStore.companies)
const loading = computed(() => companyStore.loading)
const selectedCompanyId = ref<string | null>(companyStore.companyId)
const showCreateModal = ref(false)

onMounted(async () => {
  await companyStore.loadCompanies()
  selectedCompanyId.value = companyStore.companyId
})

function selectCompany(company: Company) {
  companyStore.setCurrentCompany(company)
  router.push({ name: ROUTE_NAMES.DASHBOARD })
}

async function handleCompanyCreated(data: any) {
  try {
    console.log('Criando empresa com dados:', data)
    // Criar a empresa via API
    const response = await organizationApi.createCompany(data)
    console.log('Empresa criada com sucesso:', response)
    const newCompany = response.data
    
    if (!newCompany) {
      throw new Error('Resposta da API não contém dados da empresa')
    }
    
    showCreateModal.value = false
    
    // Recarregar lista de empresas
    await companyStore.loadCompanies()
    
    // Selecionar a empresa recém-criada automaticamente
    selectCompany(newCompany)
  } catch (err: any) {
    console.error('Erro ao criar empresa:', err)
    const errorMessage = err.response?.data?.message 
      || err.response?.data?.error 
      || err.message 
      || 'Erro ao criar empresa. Verifique os dados e tente novamente.'
    alert(errorMessage)
  }
}
</script>


<style scoped>
.company-selection {
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem;
}

.company-selection-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.company-selection-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 2rem 0;
}

.company-selection-loading,
.company-selection-empty {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.company-list-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.company-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.company-list-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.company-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 1rem;
}

.company-card {
  padding: 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.company-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.company-card-selected {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.company-card-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.company-card-cnpj {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}
</style>

