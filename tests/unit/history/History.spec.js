import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import HistoryPage from '@/components/draw/History.vue'
import { useRouter } from 'vue-router'
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import { toast } from 'vue3-toastify'
import { createI18n } from 'vue-i18n'

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn()
}))

jest.mock('vue-router', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/firebase', () => ({
  db: {}
}))

jest.mock('vue3-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}))

describe('HistoryPage.vue', () => {
  let routerPushMock
  let wrapper
  let i18n

  const messages = {
    en: {
      history: {
        title: 'History',
        noHistory: 'No draw history available.',
        drawNumber: 'Draw Number',
        drawnNumbers: 'Drawn Numbers',
        status: 'Status',
        amount: 'Amount',
        actions: 'Actions',
        won: 'Won',
        lost: 'Lost',
        fetchError: 'Error fetching draw history.',
        deleteSuccess: 'Draw deleted successfully.',
        deleteError: 'Error deleting draw.'
      }
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()

    i18n = createI18n({
      locale: 'en',
      messages
    })

    routerPushMock = jest.fn()
    useRouter.mockReturnValue({
      push: routerPushMock
    })

    collection.mockReturnValue('mockCollection')
    orderBy.mockReturnValue('mockOrderBy')
    query.mockReturnValue('mockQuery')
    doc.mockReturnValue('mockDoc')

    wrapper = mount(HistoryPage, {
      global: {
        plugins: [i18n]
      }
    })
  })

  const mockDrawHistoryData = [
    {
      id: '1',
      drawnNumbers: [5, 12, 23, 34, 45],
      playerBet: [5, 23, 34],
      totalWinnings: 100,
      timestamp: new Date()
    },
    {
      id: '2',
      drawnNumbers: [3, 14, 25, 36, 47],
      playerBet: [14, 25],
      totalWinnings: 0,
      timestamp: new Date()
    }
  ]

  it('renders draw history table when data is available', async () => {
    getDocs.mockResolvedValue({
      docs: mockDrawHistoryData.map(data => ({
        id: data.id,
        data: () => data
      }))
    })

    wrapper = mount(HistoryPage, {
      global: {
        plugins: [i18n]
      }
    })

    await flushPromises()

    expect(wrapper.text()).not.toContain(messages.en.history.noHistory)
    expect(wrapper.text()).toContain(messages.en.history.drawNumber)
    expect(wrapper.text()).toContain(messages.en.history.drawnNumbers)
    expect(wrapper.text()).toContain(messages.en.history.status)
    expect(wrapper.text()).toContain(messages.en.history.amount)
    expect(wrapper.text()).toContain(messages.en.history.actions)
  })

  it('calls showDetails method with correct draw', async () => {
    getDocs.mockResolvedValue({
      docs: mockDrawHistoryData.map(data => ({
        id: data.id,
        data: () => data
      }))
    })

    wrapper = mount(HistoryPage, {
      global: {
        plugins: [i18n]
      }
    })

    await flushPromises()

    await wrapper.findAll('.history-page__item').at(0).trigger('click')

    expect(routerPushMock).toHaveBeenCalledWith({
      name: 'DrawDetails',
      params: { id: '1' }
    })
  })

  it('calls deleteDraw method and updates drawHistory', async () => {
    getDocs.mockResolvedValue({
      docs: mockDrawHistoryData.map(data => ({
        id: data.id,
        data: () => data
      }))
    })

    wrapper = mount(HistoryPage, {
      global: {
        plugins: [i18n]
      }
    })

    await flushPromises()

    deleteDoc.mockResolvedValue()

    const deleteButtons = wrapper.findAll('.history-page__delete-btn')
    await deleteButtons.at(0).trigger('click')

    expect(deleteDoc).toHaveBeenCalledWith('mockDoc')
    expect(toast.success).toHaveBeenCalledWith(messages.en.history.deleteSuccess)
    expect(wrapper.vm.drawHistory).toHaveLength(1)
    expect(wrapper.vm.drawHistory[0].id).toBe('2')
    expect(wrapper.text()).toContain('2')
  })

  it('displays "No draw history available." when drawHistory is empty', async () => {
    getDocs.mockResolvedValue({
      docs: []
    })

    wrapper = mount(HistoryPage, {
      global: {
        plugins: [i18n]
      }
    })

    await flushPromises()

    expect(wrapper.text()).toContain(messages.en.history.noHistory)
    expect(wrapper.text()).not.toContain(messages.en.history.drawNumber)
    expect(wrapper.text()).not.toContain(messages.en.history.drawnNumbers)
    expect(wrapper.text()).not.toContain(messages.en.history.status)
    expect(wrapper.text()).not.toContain(messages.en.history.amount)
    expect(wrapper.text()).not.toContain(messages.en.history.actions)
  })

  it('handles fetchDrawHistory error gracefully', async () => {
    getDocs.mockRejectedValue(new Error('Firestore fetch error'))

    wrapper = mount(HistoryPage, {
      global: {
        plugins: [i18n]
      }
    })

    await flushPromises()

    expect(toast.error).toHaveBeenCalledWith(messages.en.history.fetchError)
    expect(wrapper.vm.drawHistory).toHaveLength(0)
  })

  it('handles deleteDraw error gracefully', async () => {
    getDocs.mockResolvedValue({
      docs: mockDrawHistoryData.map(data => ({
        id: data.id,
        data: () => data
      }))
    })

    wrapper = mount(HistoryPage, {
      global: {
        plugins: [i18n]
      }
    })

    await flushPromises()

    deleteDoc.mockRejectedValue(new Error('Firestore delete error'))

    const deleteButtons = wrapper.findAll('.history-page__delete-btn')
    await deleteButtons.at(0).trigger('click')

    expect(deleteDoc).toHaveBeenCalledWith('mockDoc')
    expect(toast.error).toHaveBeenCalledWith(messages.en.history.deleteError)
    expect(wrapper.vm.drawHistory).toHaveLength(2)
  })
})