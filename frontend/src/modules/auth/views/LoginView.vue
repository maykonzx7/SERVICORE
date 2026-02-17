<template>
  <AuthLayout>
    <div class="login-view">
      <h2 class="login-title">Entrar</h2>
      <p class="login-subtitle">Acesse sua conta para continuar</p>
      <LoginForm />
      <div class="login-footer">
        <p class="login-footer-text">
          Não tem uma conta?
          <router-link :to="{ name: ROUTE_NAMES.REGISTER }" class="login-footer-link">
            Registre-se
          </router-link>
        </p>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthLayout from '@/shared/layouts/AuthLayout.vue'
import LoginForm from '../components/LoginForm.vue'
import { ROUTE_NAMES } from '@/shared/constants/routes'
</script>

<style scoped>
.login-view {
  width: 100%;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.login-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.login-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.login-footer-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.login-footer-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.25rem;
}

.login-footer-link:hover {
  text-decoration: underline;
}
</style>

