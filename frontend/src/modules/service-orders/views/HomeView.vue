<template>
  <div class="home">
    <h1>Bem-vindo ao ServiCore</h1>
    <p>Sistema de gestão de ordens de serviço</p>
    <div class="actions">
      <router-link to="/service-orders" class="btn-primary">
        Ver Ordens de Serviço
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// Home view
</script>

<style scoped>
.home {
  text-align: center;
  padding: 40px 20px;
}

.home h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  color: #2c3e50;
}

.home p {
  font-size: 1.2em;
  color: #7f8c8d;
  margin-bottom: 30px;
}

.actions {
  margin-top: 30px;
}

.btn-primary {
  display: inline-block;
  padding: 12px 24px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #35a372;
}
</style>

