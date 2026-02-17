<template>
  <DashboardLayout>
    <div class="company-details-view">
      <div v-if="loading" class="company-details-loading">
        Carregando...
      </div>
      <div v-else-if="company" class="company-details-content">
        <div class="company-details-header">
          <h1 class="company-details-title">{{ company.name }}</h1>
          <Button variant="outline" @click="showEditModal = true">
            Editar
          </Button>
        </div>
        
        <div class="company-details-info">
          <div class="info-section">
            <h3>Informações Básicas</h3>
            <div class="info-item">
              <span class="info-label">CNPJ:</span>
              <span class="info-value">{{ company.cnpj ? formatCNPJ(company.cnpj) : '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email:</span>
              <span class="info-value">{{ company.email || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Telefone:</span>
              <span class="info-value">{{ company.phone || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="info-value">
                <span :class="company.active ? 'status-active' : 'status-inactive'">
                  {{ company.active ? 'Ativa' : 'Inativa' }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modal de edição -->
      <Modal v-model="showEditModal" title="Editar Empresa" @close="showEditModal = false">
        <CompanyForm
          :company="company"
          @submit="handleUpdateCompany"
          @cancel="showEditModal = false"
        />
      </Modal>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { organizationApi } from '../api/organization.api'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Button from '@/shared/components/ui/Button.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import CompanyForm from '../components/CompanyForm.vue'
import type { Company, UpdateCompanyDto } from '../types/organization.types'
import { formatCNPJ } from '@/shared/utils/formatters'

const route = useRoute()

const company = ref<Company | null>(null)
const loading = ref(false)
const showEditModal = ref(false)

onMounted(async () => {
  await loadCompany()
})

async function loadCompany() {
  loading.value = true
  try {
    const id = route.params.id as string
    const response = await organizationApi.getCompanyById(id)
    company.value = response.data
  } catch (err) {
    // Tratar erro
  } finally {
    loading.value = false
  }
}

async function handleUpdateCompany(data: UpdateCompanyDto) {
  try {
    const id = route.params.id as string
    await organizationApi.updateCompany(id, data)
    await loadCompany()
    showEditModal.value = false
  } catch (err) {
    // Erro já está sendo tratado
  }
}
</script>

<style scoped>
.company-details-view {
  max-width: 64rem;
  margin: 0 auto;
}

.company-details-loading {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.company-details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.company-details-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.company-details-info {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.info-section {
  margin-bottom: 1.5rem;
}

.info-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.info-item {
  display: flex;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 500;
  color: #6b7280;
  width: 8rem;
}

.info-value {
  color: #111827;
}

.status-active {
  color: #10b981;
  font-weight: 500;
}

.status-inactive {
  color: #ef4444;
  font-weight: 500;
}
</style>

