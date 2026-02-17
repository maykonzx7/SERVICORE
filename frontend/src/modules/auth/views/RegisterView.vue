<template>
  <AuthLayout>
    <div class="register-view">
      <h2 class="register-title">Criar Conta</h2>
      <p class="register-subtitle">Preencha os dados para criar sua conta</p>
      <RegisterForm />
      <div class="register-footer">
        <p class="register-footer-text">
          Já tem uma conta?
          <router-link :to="{ name: ROUTE_NAMES.LOGIN }" class="register-footer-link">
            Faça login
          </router-link>
        </p>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthLayout from '@/shared/layouts/AuthLayout.vue'
import RegisterForm from '../components/RegisterForm.vue'
import { ROUTE_NAMES } from '@/shared/constants/routes'
</script>

<style scoped>
.register-view {
  width: 100%;
}

.register-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.register-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.register-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.register-footer-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.register-footer-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.25rem;
}

.register-footer-link:hover {
  text-decoration: underline;
}
</style>

