<template>
    <form @submit.prevent="submit" class="register-form">
      <h2 class="register-form__title">Register</h2>
      <div class="register-form__group">
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
      <div class="register-form__group">
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
      <div class="register-form__group">
        <Input
          label="Confirm Password:"
          v-model="confirmPassword"
          :error="confirmPasswordError"
          :isValid="isConfirmPasswordValid"
          placeholder="Confirm your password"
          type="password"
          @blur="validateConfirmPassword"
        />
      </div>
      <div class="register-form__actions">
        <button type="submit" class="register-form__submit-btn">Register</button>
        <a href="#" @click.prevent="$emit('toggle-form')" class="register-form__signin-link">Back to Sign In</a>
      </div>
    </form>
  </template>

<script>
import { ref, watch } from 'vue'
import Input from '@/components/common/Input.vue'
import { createUserWithEmailAndPassword, auth } from '@/firebase'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default {
  name: 'RegisterForm',
  components: {
    Input
  },
  emits: ['register', 'toggle-form'],
  setup (props, { emit }) {
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const emailError = ref('')
    const passwordError = ref('')
    const confirmPasswordError = ref('')
    const isEmailValid = ref(false)
    const isPasswordValid = ref(false)
    const isConfirmPasswordValid = ref(false)
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

    const validateConfirmPassword = () => {
      if (!confirmPassword.value) {
        confirmPasswordError.value = 'Please confirm your password'
        isConfirmPasswordValid.value = false
      } else if (confirmPassword.value !== password.value) {
        confirmPasswordError.value = 'Passwords do not match'
        isConfirmPasswordValid.value = false
      } else {
        confirmPasswordError.value = ''
        isConfirmPasswordValid.value = true
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

    watch(confirmPassword, () => {
      if (formSubmitted.value) {
        validateConfirmPassword()
      }
    })

    const validateForm = () => {
      validateEmail()
      validatePassword()
      validateConfirmPassword()
      return isEmailValid.value && isPasswordValid.value && isConfirmPasswordValid.value
    }

    const submit = async () => {
      formSubmitted.value = true
      if (validateForm()) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
          const user = userCredential.user
          emit('register', user)
          toast.success('Registration successful! You will be redirected to login form...', {
            autoClose: 1000,
            onClose: () => {
              emit('toggle-form')
            }
          })
        } catch (error) {
          console.log(error)
          toast.error('Registration failed! ' + error, {
            autoClose: 4000
          })
        }
      }
    }

    return {
      email,
      password,
      confirmPassword,
      emailError,
      passwordError,
      confirmPasswordError,
      isEmailValid,
      isPasswordValid,
      isConfirmPasswordValid,
      validateEmail,
      validatePassword,
      validateConfirmPassword,
      submit
    }
  }
}
</script>

  <style lang="scss" scoped>
  .register-form {
    width: 100%;

    &__title {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 1rem;
      text-align: center;
      color: #333333;
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

    &__signin-link {
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
