import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/base.css'
import { auth } from './firebase'
import VueFinalModal from 'vue-final-modal'
import 'vue-final-modal/style.css'
import { createI18n } from 'vue-i18n'

import en from './i18n/en.json'
import el from './i18n/el.json'

const savedLanguage = localStorage.getItem('language') || 'en'

const i18n = createI18n({
  legacy: false,
  locale: savedLanguage,
  fallbackLocale: 'en',
  messages: { en, el }
})

const app = createApp(App)

app.use(router)
app.use(VueFinalModal)
app.use(i18n) // Move this line before mounting the app

app.config.globalProperties.$auth = auth

app.mount('#app')
