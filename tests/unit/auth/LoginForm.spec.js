import { mount } from '@vue/test-utils'
import LoginForm from '@/components/auth/LoginForm.vue'
import Input from '@/components/common/Input.vue'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import { useRouter } from 'vue-router'

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn()
}))

jest.mock('vue-router', () => ({
  useRouter: jest.fn()
}))

describe('LoginForm.vue', () => {
  let wrapper
  const mockAuth = {}
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    getAuth.mockReturnValue(mockAuth)

    useRouter.mockReturnValue({
      push: mockPush
    })

    wrapper = mount(LoginForm, {
      global: {
        components: {
          Input
        }
      }
    })
  })

  const findInputByLabel = (labelText) => {
    const inputs = wrapper.findAllComponents(Input)
    return inputs.find(inputWrapper => inputWrapper.props('label') === labelText)
  }

  it('renders the form correctly', () => {
    expect(wrapper.find('form.login-form').exists()).toBe(true)
    expect(wrapper.find('h2.login-form__title').text()).toBe('Sign In')
    expect(wrapper.findAllComponents(Input)).toHaveLength(2)
    expect(wrapper.find('button.login-form__submit-btn').exists()).toBe(true)
    expect(wrapper.find('a.login-form__register-link').exists()).toBe(true)
  })

  it('validates email correctly', async () => {
    const emailInputWrapper = findInputByLabel('Email:')
    const emailInput = emailInputWrapper.find('input')

    await emailInput.setValue('')
    await emailInput.trigger('blur')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.emailError).toBe('Email is required')
    expect(wrapper.vm.isEmailValid).toBe(false)

    await emailInput.setValue('invalid-email')
    await emailInput.trigger('blur')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.emailError).toBe('Please enter a valid email address')
    expect(wrapper.vm.isEmailValid).toBe(false)

    await emailInput.setValue('valid@example.com')
    await emailInput.trigger('blur')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.emailError).toBe('')
    expect(wrapper.vm.isEmailValid).toBe(true)
  })

  it('validates password correctly', async () => {
    const passwordInputWrapper = findInputByLabel('Password:')
    const passwordInput = passwordInputWrapper.find('input')

    await passwordInput.setValue('')
    await passwordInput.trigger('blur')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.passwordError).toBe('Password is required')
    expect(wrapper.vm.isPasswordValid).toBe(false)

    await passwordInput.setValue('12345')
    await passwordInput.trigger('blur')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.passwordError).toBe('Password must be at least 6 characters long')
    expect(wrapper.vm.isPasswordValid).toBe(false)

    await passwordInput.setValue('password123')
    await passwordInput.trigger('blur')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.passwordError).toBe('')
    expect(wrapper.vm.isPasswordValid).toBe(true)
  })

  it('emits "toggle-form" event when "Register now" link is clicked', async () => {
    const toggleLink = wrapper.find('a.login-form__register-link')
    await toggleLink.trigger('click.prevent')
    expect(wrapper.emitted('toggle-form')).toBeTruthy()
    expect(wrapper.emitted('toggle-form').length).toBe(1)
  })

  it('does not submit the form if validation fails', async () => {
    await wrapper.find('form').trigger('submit.prevent')

    expect(signInWithEmailAndPassword).not.toHaveBeenCalled()
    expect(wrapper.emitted('login')).toBeFalsy()
    expect(mockPush).not.toHaveBeenCalled()
    expect(wrapper.vm.emailError).toBe('Email is required')
    expect(wrapper.vm.passwordError).toBe('Password is required')
  })

  it('handles login failure gracefully', async () => {
    const mockError = new Error('Login failed')
    signInWithEmailAndPassword.mockRejectedValue(mockError)

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const emailInput = findInputByLabel('Email:').find('input')
    const passwordInput = findInputByLabel('Password:').find('input')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, 'test@example.com', 'password123')
    expect(wrapper.emitted('login')).toBeFalsy()
    expect(mockPush).not.toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith('Error signing in:', mockError.message)
    consoleSpy.mockRestore()
  })
})