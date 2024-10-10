
import { mount } from '@vue/test-utils'
import HomePage from '@/components/homepage/HomePage.vue'
import { useI18n } from 'vue-i18n'



jest.mock('vue-i18n', () => ({
  useI18n: jest.fn(() => ({
    t: (key) => key,
    locale: { value: 'en' }
  }))
}))

describe('HomePage.vue', () => {
  let wrapper

  beforeEach(() => {
    jest.clearAllMocks()
    wrapper = mount(HomePage, {
      global: {

        mocks: {
          $t: (key) => key
        }
      }
    })
  })


  afterEach(() => {
    wrapper.unmount()
  })

  it('renders 30 lottery number buttons with correct labels', () => {
    const buttons = wrapper.findAll('.lottery__number-button')
    expect(buttons).toHaveLength(30)
    for (let i = 1; i <= 30; i++) {
      expect(buttons[i - 1].text()).toBe(String(i))
    }
  })

  it('allows selecting up to 5 numbers', async () => {
    const buttons = wrapper.findAll('.lottery__number-button')

    // 5 Brojeva izabrano...
    for (let i = 0; i < 5; i++) {
      await buttons[i].trigger('click')
      expect(buttons[i].classes()).toContain('lottery__number-button--selected')
      const selectedNumbers = wrapper.findAll('.lottery__selected-item')
      expect(selectedNumbers).toHaveLength(i + 1)
      expect(selectedNumbers[i].text()).toContain(String(i + 1))
    }
    await buttons[5].trigger('click')
    expect(buttons[5].classes()).not.toContain('lottery__number-button--selected')
    const selectedNumbersAfter = wrapper.findAll('.lottery__selected-item')
    expect(selectedNumbersAfter).toHaveLength(5)
  })

  it('disables unselected buttons when 5 numbers are selected', async () => {
    const buttons = wrapper.findAll('.lottery__number-button')

    // Select 5 numbrs
    for (let i = 0; i < 5; i++) {
      await buttons[i].trigger('click')
    }

    // Check that the remaining buttons are disabled
    for (let i = 5; i < 30; i++) {
      expect(buttons[i].attributes('disabled')).toBeDefined()
    }

    // Deselect one number
    await buttons[0].trigger('click')
    expect(buttons[0].classes()).not.toContain('lottery__number-button--selected')

    // Now, the previously disabled buttons should be enabled
    for (let i = 5; i < 30; i++) {
      expect(buttons[i].attributes('disabled')).toBeUndefined()
    }
  })

  it('enables the submit button only when 5 numbers are selected', async () => {
    const buttons = wrapper.findAll('.lottery__number-button')
    const submitButton = wrapper.find('.lottery__submit-button')

    expect(submitButton.attributes('disabled')).toBeDefined()

    for (let i = 0; i < 3; i++) {
      await buttons[i].trigger('click')
    }
    expect(submitButton.attributes('disabled')).toBeDefined()
    for (let i = 3; i < 5; i++) {
      await buttons[i].trigger('click')
    }
    expect(submitButton.attributes('disabled')).toBeUndefined()
  })

  it('allows deselecting a selected number via delete button', async () => {
    const buttons = wrapper.findAll('.lottery__number-button')
    const firstButton = buttons[0]

    await firstButton.trigger('click')
    expect(firstButton.classes()).toContain('lottery__number-button--selected')
    let selectedNumbers = wrapper.findAll('.lottery__selected-item')
    expect(selectedNumbers).toHaveLength(1)
    expect(selectedNumbers[0].text()).toContain('1')

    const deleteButton = selectedNumbers[0].find('.lottery__delete-button')
    await deleteButton.trigger('click')
    expect(firstButton.classes()).not.toContain('lottery__number-button--selected')
    selectedNumbers = wrapper.findAll('.lottery__selected-item')
    expect(selectedNumbers).toHaveLength(0)
  })
})
