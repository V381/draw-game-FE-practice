import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/base.css'
import { auth } from './firebase'

const app = createApp(App)
app.use(router)

app.config.globalProperties.$auth = auth

app.mount('#app')
