import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/base.css'
import { auth } from './firebase'
import VueFinalModal from 'vue-final-modal'
import 'vue-final-modal/style.css'

const app = createApp(App)
app.use(router)
app.use(VueFinalModal)

app.config.globalProperties.$auth = auth

app.mount('#app')
