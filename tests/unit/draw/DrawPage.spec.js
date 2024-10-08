import { mount } from '@vue/test-utils'
import DrawPage from '@/components/draw/Draw.vue'
import Modal from '@/components/common/Modal.vue'
import flushPromises from 'flush-promises'
import { nextTick } from 'vue'
import shuffleArray from '@/utils/shuffleArray'

jest.mock('vue-router', () => ({
  useRoute: () => ({
    query: {
      numbers: '1,2,3,4,5'
    }
  }),
  useRouter: () => ({
    push: jest.fn()
  }),
  onBeforeRouteLeave: jest.fn()
}))

jest.mock('@/components/common/Modal.vue', () => ({
  name: 'Modal',
  template: '<div class="modal"><slot></slot></div>'
}))

jest.mock('@/utils/shuffleArray')

describe('Testing DrawPage.vue component....', () => {
  let wrapper
  let mockRouterPush

  beforeEach(() => {
    jest.clearAllMocks()

    const sessionStorageMock = (() => {
      let store = {}
      return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
          store[key] = value.toString()
        }),
        removeItem: jest.fn((key) => {
          delete store[key]
        }),
        clear: jest.fn(() => {
          store = {}
        })
      }
    })()

    const localStorageMock = (() => {
      let store = {}
      return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
          store[key] = value.toString()
        }),
        removeItem: jest.fn((key) => {
          delete store[key]
        }),
        clear: jest.fn(() => {
          store = {}
        })
      }
    })()

    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock
    })

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    })

    jest.useFakeTimers()

    window.confirm = jest.fn(() => true)
    window.alert = jest.fn()

    const { useRouter } = require('vue-router')
    const router = useRouter()
    mockRouterPush = router.push

    shuffleArray.mockImplementation(() => [5, 4, 3, 2, 1, 6, 7, 8, 9, 10])

    wrapper = mount(DrawPage, {
      global: {
        mocks: {
          $route: {
            query: {
              numbers: '1,2,3,4,5'
            }
          },
          $router: {
            push: mockRouterPush
          }
        },
        stubs: {
          Modal
        }
      }
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders the component correctly', () => {
    expect(wrapper.find('.draw-page__title').text()).toBe('Lottery Draw')
    expect(wrapper.find('.draw-page__subtitle').exists()).toBe(true)
    expect(wrapper.find('.draw-page__winnings-title').exists()).toBe(true)
    expect(wrapper.findComponent(Modal).exists()).toBe(true)
  })

  it('initializes userNumbers from route query when sessionStorage is empty', () => {
    expect(wrapper.vm.userNumbers).toEqual([1, 2, 3, 4, 5])
    expect(window.sessionStorage.getItem).toHaveBeenCalledWith('selectedNumbers')
  })

  it('draws numbers and updates drawnNumbers', async () => {
    jest.advanceTimersByTime(3000)
    await flushPromises()

    for (let i = 0; i < 5; i++) {
      jest.advanceTimersByTime(4000)
      await flushPromises()
      expect(wrapper.vm.drawnNumbers[i]).toBe(5 - i)
    }

    expect(wrapper.vm.showModal).toBe(true)
    expect(wrapper.vm.matchedNumbers).toEqual([5, 4, 3, 2, 1])
  })

  it('calculates total winnings correctly', async () => {
    jest.advanceTimersByTime(3000)
    await flushPromises()

    jest.advanceTimersByTime(4000)
    await flushPromises()
    expect(wrapper.vm.matchedNumbers).toEqual([5, 4])
    expect(wrapper.vm.totalWinnings).toBe(0)

    jest.advanceTimersByTime(4000)
    await flushPromises()
    expect(wrapper.vm.matchedNumbers).toEqual([5, 4, 3])
    expect(wrapper.vm.totalWinnings).toBe(5)

    jest.advanceTimersByTime(4000)
    await flushPromises()
    expect(wrapper.vm.matchedNumbers).toEqual([5, 4, 3, 2])
    expect(wrapper.vm.totalWinnings).toBe(10)

    jest.advanceTimersByTime(4000)
    await flushPromises()
    expect(wrapper.vm.matchedNumbers).toEqual([5, 4, 3, 2, 1])
    expect(wrapper.vm.totalWinnings).toBe(20)
  })

  it('displays matched numbers with correct classes', async () => {
    jest.advanceTimersByTime(3000)
    await flushPromises()

    for (let i = 0; i < 5; i++) {
      jest.advanceTimersByTime(4000)
      await flushPromises()
    }

    await nextTick()

    const drawnNumberElements = wrapper.findAll('.draw-page__section--drawn .draw-page__number')
    drawnNumberElements.forEach((el, index) => {
      const number = [5, 4, 3, 2, 1][index]
      if (wrapper.vm.userNumbers.includes(number)) {
        expect(el.classes()).toContain('draw-page__number--matched')
      } else {
        expect(el.classes()).not.toContain('draw-page__number--matched')
      }
    })

    const userNumberElements = wrapper.findAll('.draw-page__section--user .draw-page__number')
    userNumberElements.forEach((el) => {
      const number = Number(el.text())
      if (wrapper.vm.matchedNumbers.includes(number)) {
        expect(el.classes()).toContain('draw-page__number--matched')
        if (wrapper.vm.isWinning && wrapper.vm.matchedNumbers.length >= 3) {
          expect(el.classes()).toContain('draw-page__number--winning')
        }
      } else {
        expect(el.classes()).not.toContain('draw-page__number--matched')
        expect(el.classes()).not.toContain('draw-page__number--winning')
      }
    })
  })

  it('shows modal with correct winnings message', async () => {
    jest.advanceTimersByTime(3000)
    await flushPromises()

    for (let i = 0; i < 5; i++) {
      jest.advanceTimersByTime(4000)
      await flushPromises()
    }

    await nextTick()

    const modal = wrapper.findComponent(Modal)
    expect(modal.exists()).toBe(true)
    expect(modal.text()).toContain('Draw Completed!')
    expect(modal.text()).toContain(`Congratulations! You won ${wrapper.vm.totalWinnings}€.`)
    expect(modal.text()).not.toContain("Sorry, you didn't win this time.")
  })

  it('prompts user when navigating away during an ongoing draw', async () => {
    window.confirm = jest.fn(() => false)
    wrapper.vm.isDrawComplete = false

    const onBeforeRouteLeave = require('vue-router').onBeforeRouteLeave
    expect(onBeforeRouteLeave).toHaveBeenCalledWith(expect.any(Function))

    const guardCallback = onBeforeRouteLeave.mock.calls[0][0]
    const to = {}
    const from = {}
    const next = jest.fn()

    guardCallback(to, from, next)
    expect(window.confirm).toHaveBeenCalledWith('The draw is in progress. Are you sure you want to leave?')
    expect(next).toHaveBeenCalledWith(false)
  })

  it('allows navigation when the draw is complete', async () => {
    wrapper.vm.isDrawComplete = true

    const onBeforeRouteLeave = require('vue-router').onBeforeRouteLeave
    expect(onBeforeRouteLeave).toHaveBeenCalledWith(expect.any(Function))

    const guardCallback = onBeforeRouteLeave.mock.calls[0][0]
    const to = {}
    const from = {}
    const next = jest.fn()

    guardCallback(to, from, next)
    expect(next).toHaveBeenCalledWith()
  })
})
