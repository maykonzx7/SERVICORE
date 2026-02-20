<template>
  <DashboardLayout>
    <div class="company-setup">
      <div class="setup-header">
        <h1 class="setup-title">Bem-vindo ao ServiCore!</h1>
        <p class="setup-subtitle">
          Para começar, vamos criar sua empresa. Você poderá gerenciar ordens de serviço,
          técnicos, clientes e muito mais.
        </p>
      </div>

      <Card>
        <CompanyForm
          @submit="handleCompanyCreated"
          :loading="creating"
        />
      </Card>

      <div class="setup-footer">
        <p class="setup-footer-text">
          Você pode pular esta etapa e criar sua empresa depois.
        </p>
        <Button variant="outline" @click="skipSetup">
          Pular por enquanto
        </Button>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '@/shared/stores/company.store'
import { organizationApi } from '../api/organization.api'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import CompanyForm from '../components/CompanyForm.vue'

const router = useRouter()
const companyStore = useCompanyStore()

const creating = ref(false)

async function handleCompanyCreated(data: any) {
  creating.value = true
  try {
    const response = await organizationApi.createCompany(data)
    const newCompany = response.data
    
    if (!newCompany) {
      throw new Error('Resposta da API não contém dados da empresa')
    }
    
    // Selecionar a empresa recém-criada
    companyStore.setCurrentCompany(newCompany)
    
    // Redirecionar para o dashboard
    router.push({ name: ROUTE_NAMES.DASHBOARD })
  } catch (err: any) {
    console.error('Erro ao criar empresa:', err)
    const errorMessage = err.response?.data?.message 
      || err.response?.data?.error 
      || err.message 
      || 'Erro ao criar empresa. Verifique os dados e tente novamente.'
    alert(errorMessage)
  } finally {
    creating.value = false
  }
}

function skipSetup() {
  // Criar uma empresa temporária/pessoal com nome baseado no usuário
  // Ou redirecionar para dashboard e permitir criar depois
  router.push({ name: ROUTE_NAMES.DASHBOARD })
}
</script>

<style scoped>
.company-setup {
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem;
}

.setup-header {
  text-align: center;
  margin-bottom: 2rem;
}

.setup-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.setup-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.setup-footer {
  margin-top: 2rem;
  text-align: center;
}

.setup-footer-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.75rem 0;
}
</style>

