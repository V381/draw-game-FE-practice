<template>
  <div id="app">
    <nav>
      <router-link to="/"></router-link>
    </nav>
    <router-view />
    <div class="language-switcher">
      <button @click="switchLanguage('en')" :class="{ active: currentLanguage === 'en' }">
        <img src="@/assets/en-flag.svg" alt="English" />
      </button>
      <button @click="switchLanguage('el')" :class="{ active: currentLanguage === 'el' }">
        <img src="@/assets/el-flag.svg" alt="Greek" />
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'App',
  setup () {
    const { locale } = useI18n()
    const currentLanguage = ref(locale.value)

    const switchLanguage = (lang) => {
      locale.value = lang
      currentLanguage.value = lang
      localStorage.setItem('language', lang)
    }

    onMounted(() => {
      const savedLanguage = localStorage.getItem('language')
      if (savedLanguage) {
        switchLanguage(savedLanguage)
      }
    })

    return {
      currentLanguage,
      switchLanguage
    }
  }
}
</script>

<style lang="scss">
body {
  background-color: var(--primary);
  background-image: url('./assets/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.language-switcher {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 1000;

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    opacity: 0.6;
    transition: opacity 0.3s ease;

    &.active,
    &:hover {
      opacity: 1;
    }

    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
  }
}
</style>
