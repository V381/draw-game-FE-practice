import { mount } from '@vue/test-utils'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import Input from '@/components/common/Input.vue'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  createUserWithEmailAndPassword: jest.fn()
}))
describe('RegisterForm.vue', () => {
  let wrapper
  const mockAuth = {}

  beforeEach(() => {
    jest.clearAllMocks()

    getAuth.mockReturnValue(mockAuth)

    wrapper = mount(RegisterForm, {
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
    expect(wrapper.find('form.register-form').exists()).toBe(true)
    expect(wrapper.find('h2.register-form__title').text()).toBe('Register')
    expect(wrapper.findAllComponents(Input)).toHaveLength(3)
    expect(wrapper.find('button.register-form__submit-btn').exists()).toBe(true)
    expect(wrapper.find('a.register-form__signin-link').exists()).toBe(true)
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

  it('validates confirm password correctly', async () => {
    const passwordInputWrapper = findInputByLabel('Password:')
    const confirmPasswordInputWrapper = findInputByLabel('Confirm Password:')
    const passwordInput = passwordInputWrapper.find('input')
    const confirmPasswordInput = confirmPasswordInputWrapper.find('input')

    await passwordInput.setValue('password123')
    await confirmPasswordInput.setValue('')
    await confirmPasswordInput.trigger('blur')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.confirmPasswordError).toBe('Please confirm your password')
    expect(wrapper.vm.isConfirmPasswordValid).toBe(false)

    await confirmPasswordInput.setValue('differentPassword')
    await confirmPasswordInput.trigger('blur')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.confirmPasswordError).toBe('Passwords do not match')
    expect(wrapper.vm.isConfirmPasswordValid).toBe(false)

    await confirmPasswordInput.setValue('password123')
    await confirmPasswordInput.trigger('blur')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.confirmPasswordError).toBe('')
    expect(wrapper.vm.isConfirmPasswordValid).toBe(true)
  })

  it('emits "toggle-form" event when "Back to Sign In" link is clicked', async () => {
    const toggleLink = wrapper.find('a.register-form__signin-link')
    await toggleLink.trigger('click.prevent')
    expect(wrapper.emitted('toggle-form')).toBeTruthy()
    expect(wrapper.emitted('toggle-form').length).toBe(1)
  })

  it('does not submit the form if validation fails', async () => {
    await wrapper.find('form').trigger('submit.prevent')

    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled()
    expect(wrapper.emitted('register')).toBeFalsy()
    expect(wrapper.emitted('toggle-form')).toBeFalsy()
    expect(wrapper.vm.emailError).toBe('Email is required')
    expect(wrapper.vm.passwordError).toBe('Password is required')
    expect(wrapper.vm.confirmPasswordError).toBe('Please confirm your password')
  })

  it('handles registration failure gracefully', async () => {
    const mockError = new Error('Registration failed')
    createUserWithEmailAndPassword.mockRejectedValue(mockError)

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    const emailInput = findInputByLabel('Email:').find('input')
    const passwordInput = findInputByLabel('Password:').find('input')
    const confirmPasswordInput = findInputByLabel('Confirm Password:').find('input')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')
    await confirmPasswordInput.setValue('password123')

    await wrapper.find('form').trigger('submit.prevent')

    await wrapper.vm.$nextTick()

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, 'test@example.com', 'password123')
    expect(wrapper.emitted('register')).toBeFalsy()
    expect(wrapper.emitted('toggle-form')).toBeFalsy()
    expect(consoleSpy).toHaveBeenCalledWith(mockError)
    consoleSpy.mockRestore()
  })
})
