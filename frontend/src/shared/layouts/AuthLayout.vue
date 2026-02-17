<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="auth-title">ServiCore</h1>
        <p class="auth-subtitle">Sistema de Gestão de Ordens de Serviço</p>
      </div>
      <div class="auth-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// AuthLayout - Layout para páginas de autenticação
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.auth-container {
  width: 100%;
  max-width: 28rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.auth-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.auth-content {
  width: 100%;
}
</style>

