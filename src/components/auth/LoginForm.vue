<template>
  <form @submit.prevent="submit" class="login-form" aria-labelledby="login-form-title">
    <h2 id="login-form-title" class="login-form__title">{{ $t('login.title') }}</h2>
    <div class="login-form__group">
      <Input
        :label="$t('login.email')"
        v-model="email"
        :error="emailError ? $t(emailError) : ''"
        :isValid="isEmailValid"
        :placeholder="$t('login.emailPlaceholder')"
        type="email"
        @blur="validateEmail"
        aria-required="true"
        :aria-invalid="!isEmailValid"
        :aria-describedby="emailError ? 'email-error' : undefined"
      />
    </div>
    <div class="login-form__group">
      <Input
        :label="$t('login.password')"
        v-model="password"
        :error="passwordError ? $t(passwordError) : ''"
        :isValid="isPasswordValid"
        :placeholder="$t('login.passwordPlaceholder')"
        type="password"
        @blur="validatePassword"
        aria-required="true"
        :aria-invalid="!isPasswordValid"
        :aria-describedby="passwordError ? 'password-error' : undefined"
      />
    </div>
    <div class="login-form__actions">
      <button type="submit" class="login-form__submit-btn">{{ $t('login.signIn') }}</button>
      <button type="button" @click="signInWithGoogle" class="login-form__google-btn" aria-label="Sign in with Google">
        <img src="@/assets/google-icon.svg" alt="" aria-hidden="true" class="google-icon" />
        {{ $t('login.signInWithGoogle') }}
      </button>
      <a href="#" @click.prevent="$emit('toggle-form')" class="login-form__register-link">
        {{ $t('login.registerNow') }}
      </a>
    </div>
  </form>
</template>

<script>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Input from '@/components/common/Input.vue'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
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
        emailError.value = 'login.errors.emailRequired'
        isEmailValid.value = false
      } else if (!emailPattern.test(email.value)) {
        emailError.value = 'login.errors.invalidEmail'
        isEmailValid.value = false
      } else {
        emailError.value = ''
        isEmailValid.value = true
      }
    }

    const validatePassword = () => {
      if (!password.value) {
        passwordError.value = 'login.errors.passwordRequired'
        isPasswordValid.value = false
      } else if (password.value.length < 6) {
        passwordError.value = 'login.errors.passwordLength'
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

    const signInWithGoogle = async () => {
      try {
        const provider = new GoogleAuthProvider()
        const userCredential = await signInWithPopup(auth, provider)
        const user = userCredential.user
        emit('login', user)
        toast.success('Google sign-in successful!', {
          autoClose: 1000,
          onClose: () => {
            router.push('/home')
          }
        })
      } catch (error) {
        console.error('Error signing in with Google:', error.message)
        toast.error('Google sign-in failed. Please try again.', {
          autoClose: 3000
        })
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
      submit,
      signInWithGoogle
    }
  }
}
</script>

<style lang="scss" scoped>
.login-form {
  width: 100%;

  &__title {
    font-size: var(--font-size-xl);
    font-weight: bold;
    margin-bottom: var(--spacing-md);
    text-align: center;
    color: var(--color-primary);
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

  &__submit-btn,
  &__google-btn {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    font-weight: bold;
    border: none;
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-md);
  }

  &__submit-btn {
    background-color: var(--bg-primary);
    color: var(--text-primary);

    &:hover {
      background-color: var(--bg-secondary);
    }
  }

  &__google-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-white);
    color: var(--text-secondary);
    border: 1px solid var(--border-secondary);

    &:hover {
      background-color: var(--border-secondary);
    }

    .google-icon {
      width: 18px;
      height: 18px;
      margin-right: var(--spacing-sm);
    }
  }

  &__register-link {
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

.language-switcher {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  gap: var(--spacing-sm);

  button {
    background: none;
    border: none;
    padding: 0;
    opacity: 0.6;
    transition: opacity var(--transition-default);

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

.error-message {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}
</style>
