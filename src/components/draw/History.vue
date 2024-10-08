<template>
    <div class="history-page">
      <h1 class="history-page__title">Draw History</h1>
      <div v-if="drawHistory.length === 0" class="history-page__no-history">
        No draw history available.
      </div>
      <table v-else class="history-page__table">
        <thead>
          <tr>
            <th class="history-page__table-header">Draw Number</th>
            <th class="history-page__table-header">Drawn Numbers</th>
            <th class="history-page__table-header">Status</th>
            <th class="history-page__table-header">Amount</th>
            <th class="history-page__table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(draw, index) in drawHistory"
            :key="draw.id"
            @click="showDetails(draw)"
            class="history-page__table-row"
          >
            <td class="history-page__table-cell">{{ drawHistory.length - index }}</td>
            <td class="history-page__table-cell">
              <span
                v-for="number in draw.drawnNumbers"
                :key="number"
                class="history-page__draw-number"
                :class="{ 'history-page__draw-number--winning': draw.playerBet.includes(number) }"
              >
                {{ number }}
              </span>
            </td>
            <td
              class="history-page__table-cell"
              :class="draw.totalWinnings > 0 ? 'history-page__status--won' : 'history-page__status--lost'"
            >
              {{ draw.totalWinnings > 0 ? 'Won' : 'Lost' }}
            </td>
            <td class="history-page__table-cell">{{ draw.totalWinnings }}€</td>
            <td class="history-page__table-cell">
              <button @click.stop="deleteDraw(draw.id)" class="history-page__delete-btn">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import { toast } from 'vue3-toastify'

export default {
  name: 'HistoryPage',
  setup () {
    const router = useRouter()
    const drawHistory = ref([])

    const fetchDrawHistory = async () => {
      const q = query(collection(db, 'drawHistory'), orderBy('timestamp', 'desc'))
      const querySnapshot = await getDocs(q)
      drawHistory.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    }

    const deleteDraw = async (id) => {
      try {
        await deleteDoc(doc(db, 'drawHistory', id))
        drawHistory.value = drawHistory.value.filter(draw => draw.id !== id)
        toast.success('Draw deleted successfully')
      } catch (error) {
        console.error('Error deleting draw:', error)
        toast.error('Failed to delete draw')
      }
    }

    const showDetails = (draw) => {
      router.push({ name: 'DrawDetails', params: { id: draw.id } })
    }

    onMounted(fetchDrawHistory)

    return {
      drawHistory,
      deleteDraw,
      showDetails
    }
  }
}
</script>

  <style scoped>
  .history-page {
    padding: 20px;
  }

  .history-page__title {
    margin-bottom: 20px;
  }

  .history-page__no-history {
    text-align: center;
    margin-top: 20px;
    font-size: 18px;
  }

  .history-page__table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  .history-page__table-header,
  .history-page__table-cell {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: center;
  }

  .history-page__table-header {
    background-color: #0A1F62;
    color: white;
  }

  .history-page__table-row:hover {
    background-color: var(--btn-hover-bg);
    cursor: pointer;
  }

  .history-page__status--won {
    color: green;
  }

  .history-page__status--lost {
    color: red;
  }

  .history-page__delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
  }

  .history-page__draw-number {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 50%;
    margin-right: 5px;
  }

  .history-page__draw-number--winning {
    background-color: #4caf50;
    color: white;
  }
  </style>
