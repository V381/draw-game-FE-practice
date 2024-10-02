<template>
    <div class="sign-in">
      <div class="sign-in__content">
        <div class="sign-in__logo-container">
          <img src="@/assets/opap.png" alt="Company Logo" class="sign-in__logo">
        </div>
        <div class="sign-in__form-wrapper">
          <form @submit.prevent="submit" class="sign-in__form">
            <h2 class="sign-in__title">Sign In</h2>
            <div class="sign-in__form-group">
              <Input
                label="Email:"
                v-model="email"
                :error="emailError"
                :isValid="isEmailValid"
                placeholder="Enter your email..."
                type="email"
                @blur="validateEmail"
              />
            </div>
            <div class="sign-in__form-group">
              <Input
                label="Password:"
                v-model="password"
                :error="passwordError"
                :isValid="isPasswordValid"
                placeholder="Enter your password"
                type="password"
                @blur="validatePassword"
              />
            </div>
            <div class="sign-in__form-actions">
              <button type="submit" class="sign-in__submit-btn">Sign In</button>
              <a href="#" @click.prevent="register" class="sign-in__register-link">Register now</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>

<script>
import { ref, watch } from 'vue'
import Input from '@/components/common/Input.vue'

export default {
  name: 'SignInForm',
  components: {
    Input
  },
  setup () {
    const email = ref('')
    const password = ref('')
    const emailError = ref('')
    const passwordError = ref('')
    const isEmailValid = ref(false)
    const isPasswordValid = ref(false)
    const formSubmitted = ref(false)

    const validateEmail = () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email.value) {
        emailError.value = 'Email is required'
        isEmailValid.value = false
      } else if (!emailPattern.test(email.value)) {
        emailError.value = 'Please enter a valid email address'
        isEmailValid.value = false
      } else {
        emailError.value = ''
        isEmailValid.value = true
      }
    }

    const validatePassword = () => {
      if (!password.value) {
        passwordError.value = 'Password is required'
        isPasswordValid.value = false
      } else if (password.value.length < 6) {
        passwordError.value = 'Password must be at least 6 characters long'
        isPasswordValid.value = false
      } else {
        passwordError.value = ''
        isPasswordValid.value = true
      }
    }

    watch(email, () => {
      if (formSubmitted.value) {
        validateEmail()
      }
    })

    watch(password, () => {
      if (formSubmitted.value) {
        validatePassword()
      }
    })

    const validateForm = () => {
      validateEmail()
      validatePassword()
      return isEmailValid.value && isPasswordValid.value
    }

    const submit = () => {
      formSubmitted.value = true
      if (validateForm()) {
        console.log('Sign in attempt with:', { email: email.value, password: password.value })
      }
    }

    const register = () => {
      console.log('Redirecting to registration page')
    }

    return {
      email,
      password,
      emailError,
      passwordError,
      isEmailValid,
      isPasswordValid,
      validateEmail,
      validatePassword,
      submit,
      register
    }
  }
}
</script>

<style lang="scss" scoped>
.sign-in {
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

  &__logo {
    width: 120px;
    height: auto;
    margin-bottom: 1rem;
  }

  &__form-wrapper {
    width: 100%;
  }

  &__form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: center;
    color: #333333;
  }

  &__form-group {
    width: 100%;
    margin-bottom: 1.5rem;
  }

  &__form-actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  &__submit-btn {
    width: 100%;
    padding: 0.75rem;
    background-color: var(--btn-bg);
    color: #ffffff;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    box-sizing: border-box;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: var(--btn-hover-bg);
    }
  }

  &__register-link {
    font-size: 0.875rem;
    font-weight: 500;
    color: #00B0FF;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: var(--btn-hover-bg);
    }
  }
}
</style>
