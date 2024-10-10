<template>
  <div class="history-page">
    <loading v-model:active="isLoading"
             :can-cancel="false"
             :is-full-page="false"
             :color="'#ffffff'"
             :background-color="'rgba(10, 31, 98, 0.9)'"
             loader="bars"/>

    <h1 class="history-page__title">Draw History</h1>
    <div v-if="drawHistory.length === 0" class="history-page__no-history"></div>
    <div v-else class="history-page__list">
      <div class="history-page__header">
        <span>Draw Number</span>
        <span>Drawn Numbers</span>
        <span>Status</span>
        <span>Amount</span>
        <span>Actions</span>
      </div>
      <div
        v-for="(draw, index) in drawHistory"
        :key="draw.id"
        @click="showDetails(draw)"
        class="history-page__item"
      >
        <span>{{ drawHistory.length - index }}</span>
        <div class="history-page__numbers">
          <span
            v-for="number in draw.drawnNumbers"
            :key="number"
            class="history-page__draw-number"
            :class="{ 'history-page__draw-number--winning': draw.playerBet.includes(number) }"
          >
            {{ number }}
          </span>
        </div>
        <span
          class="history-page__status"
          :class="draw.totalWinnings > 0 ? 'history-page__status--won' : 'history-page__status--lost'"
        >
          {{ draw.totalWinnings > 0 ? 'Won' : 'Lost' }}
        </span>
        <span>{{ draw.totalWinnings }}€</span>
        <button @click.stop="deleteDraw(draw.id)" class="history-page__delete-btn">
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import { toast } from 'vue3-toastify'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

export default {
  name: 'HistoryPage',
  components: {
    Loading
  },
  setup () {
    const router = useRouter()
    const drawHistory = ref([])
    const isLoading = ref(false)

    const fetchDrawHistory = async () => {
      isLoading.value = true
      try {
        const q = query(collection(db, 'drawHistory'), orderBy('timestamp', 'desc'))
        const querySnapshot = await getDocs(q)
        drawHistory.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (error) {
        console.error('Error fetching draw history:', error)
        toast.error('Failed to fetch draw history')
      } finally {
        isLoading.value = false
      }
    }

    const deleteDraw = async (id) => {
      isLoading.value = true
      try {
        await deleteDoc(doc(db, 'drawHistory', id))
        drawHistory.value = drawHistory.value.filter(draw => draw.id !== id)
        toast.success('Draw deleted successfully')
      } catch (error) {
        console.error('Error deleting draw:', error)
        toast.error('Failed to delete draw')
      } finally {
        isLoading.value = false
      }
    }

    const showDetails = (draw) => {
      router.push({ name: 'DrawDetails', params: { id: draw.id } })
    }

    onMounted(fetchDrawHistory)

    return {
      drawHistory,
      deleteDraw,
      showDetails,
      isLoading
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

  .history-page__list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .history-page__header,
  .history-page__item {
    display: grid;
    grid-template-columns: 0.5fr 2fr 0.5fr 0.5fr 0.5fr;
    align-items: center;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .history-page__header {
    background-color: #0A1F62;
    color: white;
    font-weight: bold;
  }

  .history-page__item {
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .history-page__item:hover {
    background-color: var(--btn-hover-bg);
  }

  .history-page__numbers {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .history-page__draw-number {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    border-radius: 50%;
  }

  .history-page__draw-number--winning {
    background-color: #4caf50;
    color: white;
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
  :deep(.vl-overlay) {
  background-color: rgba(10, 31, 98, 0.9) !important;
}

:deep(.vl-icon) {
  stroke: #ffffff !important;
}

:deep(.vl-backdrop) {
  backdrop-filter: blur(5px);
}
  </style>
