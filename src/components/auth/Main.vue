<template>
    <div class="auth-container">
      <div class="auth-container__content">
        <div class="auth-container__logo-container">
          <img src="@/assets/opap.png" alt="Company Logo" class="auth-container__logo">
        </div>
        <div class="auth-container__form-wrapper">
          <LoginForm v-if="!showRegisterForm" @toggle-form="toggleForm" @login="handleLogin" />
          <RegisterForm v-else @toggle-form="toggleForm" @register="handleRegister" />
        </div>
      </div>
    </div>
  </template>

<script>
import { ref } from 'vue'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'

export default {
  name: 'SignInRegisterContainer',
  components: {
    LoginForm,
    RegisterForm
  },
  setup () {
    const showRegisterForm = ref(false)

    const toggleForm = () => {
      showRegisterForm.value = !showRegisterForm.value
    }

    const handleLogin = (data) => {
      console.log('Login:', data)
    }

    const handleRegister = (data) => {
      console.log('Register:', data)
    }

    return {
      showRegisterForm,
      toggleForm,
      handleLogin,
      handleRegister
    }
  }
}
</script>

  <style lang="scss" scoped>
  .auth-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;

    &__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 400px;
      padding: 2rem;
      background-color: #ffffff;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    &__logo-container {
      margin-bottom: 2rem;
    }

    &__logo {
      width: 120px;
      height: auto;
    }

    &__form-wrapper {
      width: 100%;
    }
  }
  </style>
