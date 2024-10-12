<template>
  <form @submit.prevent="submit" class="register-form" aria-labelledby="register-form-title">
    <h2 id="register-form-title" class="register-form__title">{{ $t('register.title') }}</h2>
    <div class="register-form__group">
      <Input
        :label="$t('register.email')"
        v-model="email"
        :error="emailError ? $t(emailError) : ''"
        :isValid="isEmailValid"
        :placeholder="$t('register.emailPlaceholder')"
        type="email"
        @blur="validateEmail"
        aria-required="true"
        :aria-invalid="!isEmailValid"
        :aria-describedby="emailError ? 'email-error' : undefined"
      />
    </div>
    <div class="register-form__group">
      <Input
        :label="$t('register.password')"
        v-model="password"
        :error="passwordError ? $t(passwordError) : ''"
        :isValid="isPasswordValid"
        :placeholder="$t('register.passwordPlaceholder')"
        type="password"
        @blur="validatePassword"
        aria-required="true"
        :aria-invalid="!isPasswordValid"
        :aria-describedby="passwordError ? 'password-error' : undefined"
      />
    </div>
    <div class="register-form__group">
      <Input
        :label="$t('register.confirmPassword')"
        v-model="confirmPassword"
        :error="confirmPasswordError ? $t(confirmPasswordError) : ''"
        :isValid="isConfirmPasswordValid"
        :placeholder="$t('register.confirmPasswordPlaceholder')"
        type="password"
        @blur="validateConfirmPassword"
        aria-required="true"
        :aria-invalid="!isConfirmPasswordValid"
        :aria-describedby="confirmPasswordError ? 'confirm-password-error' : undefined"
      />
    </div>
    <div class="register-form__actions">
      <button type="submit" class="register-form__submit-btn">{{ $t('register.submit') }}</button>
      <a href="#" @click.prevent="$emit('toggle-form')" class="register-form__signin-link" aria-label="{{ $t('register.backToSignIn') }}">
        {{ $t('register.backToSignIn') }}
      </a>
    </div>
  </form>
</template>

<script>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
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
    const { t } = useI18n()
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
        emailError.value = 'register.errors.emailRequired'
        isEmailValid.value = false
      } else if (!emailPattern.test(email.value)) {
        emailError.value = 'register.errors.invalidEmail'
        isEmailValid.value = false
      } else {
        emailError.value = ''
        isEmailValid.value = true
      }
    }

    const validatePassword = () => {
      if (!password.value) {
        passwordError.value = 'register.errors.passwordRequired'
        isPasswordValid.value = false
      } else if (password.value.length < 6) {
        passwordError.value = 'register.errors.passwordLength'
        isPasswordValid.value = false
      } else {
        passwordError.value = ''
        isPasswordValid.value = true
      }
    }

    const validateConfirmPassword = () => {
      if (!confirmPassword.value) {
        confirmPasswordError.value = 'register.errors.confirmPasswordRequired'
        isConfirmPasswordValid.value = false
      } else if (confirmPassword.value !== password.value) {
        confirmPasswordError.value = 'register.errors.passwordMismatch'
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
          toast.success(t('register.successMessage'), {
            autoClose: 1000,
            onClose: () => {
              emit('toggle-form')
            }
          })
        } catch (error) {
          console.log(error)
          toast.error(t('register.errorMessage', { error: error.message }), {
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
    font-size: var(--font-size-xl);
    font-weight: bold;
    margin-bottom: var(--spacing-md);
    text-align: center;
    color: var(--text-secondary);
  }

  &__group {
    margin-bottom: var(--spacing-lg);
  }

  &__actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
  }

  &__submit-btn {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--bg-primary);
    color: var(--text-primary);
    font-weight: bold;
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: background-color var(--transition-default);

    &:hover {
      background-color: var(--bg-secondary);
    }
  }

  &__signin-link {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-secondary);
    text-decoration: none;
    transition: color var(--transition-default);

    &:hover {
      color: var(--bg-secondary);
    }
  }
}

.error-message {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}
</style>
