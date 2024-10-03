<template>
    <form @submit.prevent="submit" class="login-form">
      <h2 class="login-form__title">Sign In</h2>
      <div class="login-form__group">
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
      <div class="login-form__group">
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
      <div class="login-form__actions">
        <button type="submit" class="login-form__submit-btn">Sign In</button>
        <a href="#" @click.prevent="$emit('toggle-form')" class="login-form__register-link">Register now</a>
      </div>
    </form>
  </template>

<script>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Input from '@/components/common/Input.vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default {
  name: 'LoginForm',
  components: {
    Input
  },
  emits: ['login', 'toggle-form'],
  setup (props, { emit }) {
    const router = useRouter()
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

    const submit = async () => {
      formSubmitted.value = true
      if (validateForm()) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
          const user = userCredential.user
          emit('login', user)
          toast.success('Login successful!', {
            autoClose: 1000,
            onClose: () => {
              router.push('/home')
            }
          })
        } catch (error) {
          console.error('Error signing in:', error.message)
          toast.error('Login failed. Please check your credentials.', {
            autoClose: 3000
          })
        }
      }
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
      submit
    }
  }
}
</script>

  <style lang="scss" scoped>
  .login-form {
    width: 100%;

    &__title {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 1rem;
      text-align: center;
      color: var(--primary);
    }

    &__group {
      margin-bottom: 1.5rem;
    }

    &__actions {
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
