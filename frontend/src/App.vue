<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/service-orders">Ordens de Serviço</router-link>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// App component
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 30px;
  text-align: center;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  margin: 0 10px;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #42b983;
}

main {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>

