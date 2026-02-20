<template>
  <div class="companies-view">
      <div class="companies-header">
        <h1 class="companies-title">Empresas</h1>
        <Button @click="showCreateModal = true">
          Nova Empresa
        </Button>
      </div>

      <div v-if="loading" class="companies-loading">
        Carregando empresas...
      </div>

      <div v-else-if="companies.length === 0" class="companies-empty">
        <p>Nenhuma empresa encontrada.</p>
        <Button @click="showCreateModal = true">
          Criar Primeira Empresa
        </Button>
      </div>

      <div v-else class="companies-list">
        <div
          v-for="company in companies"
          :key="company.id"
          class="company-card"
          :class="{ 'company-card-active': company.id === currentCompanyId }"
          @click="selectCompany(company)"
        >
          <div class="company-card-header">
            <h3 class="company-card-name">{{ company.name }}</h3>
            <span v-if="company.id === currentCompanyId" class="company-card-badge">
              Atual
            </span>
          </div>
          <div v-if="company.cnpj" class="company-card-info">
            CNPJ: {{ formatCNPJ(company.cnpj) }}
          </div>
          <div v-if="company.email" class="company-card-info">
            {{ company.email }}
          </div>
          <div class="company-card-actions">
            <Button
              variant="outline"
              size="sm"
              @click.stop="viewCompany(company)"
            >
              Ver Detalhes
            </Button>
          </div>
        </div>
      </div>

      <!-- Modal de criação -->
      <Modal v-model="showCreateModal" title="Nova Empresa" @close="resetForm">
        <CompanyForm
          :company="formCompany"
          @submit="handleCreateCompany"
          @cancel="showCreateModal = false"
        />
      </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '@/shared/stores/company.store'
import { organizationApi } from '../api/organization.api'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import Button from '@/shared/components/ui/Button.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import CompanyForm from '../components/CompanyForm.vue'
import type { Company, CreateCompanyDto } from '../types/organization.types'
import { formatCNPJ } from '@/shared/utils/formatters'

const router = useRouter()
const companyStore = useCompanyStore()

const companies = computed(() => companyStore.companies)
const currentCompanyId = computed(() => companyStore.companyId)
const loading = computed(() => companyStore.loading)

const showCreateModal = ref(false)
const formCompany = ref<Partial<CreateCompanyDto>>({})

onMounted(async () => {
  await companyStore.loadCompanies()
})

function selectCompany(company: Company) {
  companyStore.setCurrentCompany(company)
  router.push({ name: ROUTE_NAMES.DASHBOARD })
}

function viewCompany(company: Company) {
  router.push({
    name: ROUTE_NAMES.COMPANY_DETAILS,
    params: { id: company.id },
  })
}

async function handleCreateCompany(data: CreateCompanyDto) {
  try {
    await organizationApi.createCompany(data)
    await companyStore.loadCompanies()
    showCreateModal.value = false
    resetForm()
  } catch (err) {
    // Erro já está no store
  }
}

function resetForm() {
  formCompany.value = {}
}
</script>

<style scoped>
.companies-view {
  max-width: 80rem;
  margin: 0 auto;
}

.companies-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.companies-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.companies-loading,
.companies-empty {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.companies-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 1.5rem;
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

.company-card-active {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.company-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.company-card-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.company-card-badge {
  padding: 0.25rem 0.5rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.company-card-info {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.company-card-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}
</style>

