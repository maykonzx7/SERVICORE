<template>
  <div class="transaction-create-view">
      <div class="view-header">
        <h1 class="view-title">Criar Transação</h1>
        <Button variant="outline" @click="goBack">
          Voltar
        </Button>
      </div>

      <div class="view-content">
        <TransactionForm @submit="handleSubmit" @cancel="goBack" />
      </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useFinancial } from '../composables/useFinancial'
import Button from '@/shared/components/ui/Button.vue'
import TransactionForm from '../components/TransactionForm.vue'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const router = useRouter()
const { goToDetails } = useFinancial()

function handleSubmit() {
  router.push({ name: ROUTE_NAMES.TRANSACTIONS })
}

function goBack() {
  router.push({ name: ROUTE_NAMES.TRANSACTIONS })
}
</script>

<style scoped>
.transaction-create-view {
  max-width: 48rem;
  margin: 0 auto;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.view-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.view-content {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
}
</style>

