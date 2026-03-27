import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

// Handle SPA redirect from 404.html (GitHub Pages workaround)
const redirect = sessionStorage.getItem('spa_redirect')
if (redirect) {
  sessionStorage.removeItem('spa_redirect')
  router.replace(redirect)
}
