import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './shared/stores/auth.store'
import { useCompanyStore } from './shared/stores/company.store'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Carregar estado inicial das stores
const authStore = useAuthStore()
const companyStore = useCompanyStore()

authStore.loadFromStorage()
companyStore.loadCurrentCompany()

app.mount('#app')

