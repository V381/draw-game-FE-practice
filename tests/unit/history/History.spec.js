import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import HistoryPage from '@/components/draw/History.vue'
import { useRouter } from 'vue-router'
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import { toast } from 'vue3-toastify'

// Mock Firestore methods with consistent return values
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

  beforeEach(() => {
    jest.clearAllMocks()
    routerPushMock = jest.fn()
    useRouter.mockReturnValue({
      push: routerPushMock
    })

    // Ensure Firestore methods return consistent mock values
    collection.mockReturnValue('mockCollection')
    orderBy.mockReturnValue('mockOrderBy')
    query.mockReturnValue('mockQuery')
    doc.mockReturnValue('mockDoc')
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

  it('fetches draw history on mount', async () => {
    // Mock getDocs to return the mockDrawHistoryData
    getDocs.mockResolvedValue({
      docs: mockDrawHistoryData.map(data => ({
        id: data.id,
        data: () => data
      }))
    })

    const wrapper = mount(HistoryPage)

    // Wait for all promises to resolve
    await flushPromises()

    // Assertions to ensure Firestore methods were called correctly
    expect(collection).toHaveBeenCalledWith(db, 'drawHistory')
    expect(orderBy).toHaveBeenCalledWith('timestamp', 'desc')
    expect(query).toHaveBeenCalledWith('mockCollection', 'mockOrderBy')
    expect(getDocs).toHaveBeenCalledWith('mockQuery')

    // Check if drawHistory has the correct length
    expect(wrapper.vm.drawHistory).toHaveLength(2)
  })

  it('renders "No draw history available." when drawHistory is empty', async () => {
    // Mock getDocs to return an empty array
    getDocs.mockResolvedValue({ docs: [] })

    const wrapper = mount(HistoryPage)
    await flushPromises()

    expect(wrapper.text()).toContain('No draw history available.')
  })

  it('renders draw history table when data is available', async () => {
    getDocs.mockResolvedValue({
      docs: mockDrawHistoryData.map(data => ({
        id: data.id,
        data: () => data
      }))
    })

    const wrapper = mount(HistoryPage)
    await flushPromises()

    expect(wrapper.text()).not.toContain('No draw history available.')
    expect(wrapper.text()).toContain('Draw Number')
    expect(wrapper.text()).toContain('Drawn Numbers')
    expect(wrapper.text()).toContain('Status')
    expect(wrapper.text()).toContain('Amount')
  })

  it('calls showDetails method with correct draw', async () => {
    // Mock getDocs to return the mockDrawHistoryData
    getDocs.mockResolvedValue({
      docs: mockDrawHistoryData.map(data => ({
        id: data.id,
        data: () => data
      }))
    })

    const wrapper = mount(HistoryPage)
    await flushPromises()

    await wrapper.vm.showDetails(mockDrawHistoryData[0])

    // Ensure router.push was called with correct parameters
    expect(routerPushMock).toHaveBeenCalledWith({
      name: 'DrawDetails',
      params: { id: '1' }
    })
  })

  it('calls deleteDraw method and updates drawHistory', async () => {
    // Mock getDocs to return the mockDrawHistoryData
    getDocs.mockResolvedValue({
      docs: mockDrawHistoryData.map(data => ({
        id: data.id,
        data: () => data
      }))
    })

    const wrapper = mount(HistoryPage)
    await flushPromises()

    deleteDoc.mockResolvedValue()

    await wrapper.vm.deleteDraw('1')

    expect(deleteDoc).toHaveBeenCalledWith('mockDoc')

    expect(toast.success).toHaveBeenCalledWith('Draw deleted successfully')

    expect(wrapper.vm.drawHistory).toHaveLength(1)
    expect(wrapper.vm.drawHistory[0].id).toBe('2')
  })

  it('handles error when deleting draw fails', async () => {
    // Mock getDocs to return the mockDrawHistoryData
    getDocs.mockResolvedValue({
      docs: mockDrawHistoryData.map(data => ({
        id: data.id,
        data: () => data
      }))
    })

    deleteDoc.mockRejectedValue(new Error('Delete failed'))

    const wrapper = mount(HistoryPage)
    await flushPromises()

    await wrapper.vm.deleteDraw('1')

    expect(deleteDoc).toHaveBeenCalledWith('mockDoc')

    expect(toast.error).toHaveBeenCalledWith('Failed to delete draw')

    expect(wrapper.vm.drawHistory).toHaveLength(2)
  })
})
