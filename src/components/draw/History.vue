<template>
  <div class="history-page" role="main">
    <loading v-model:active="isLoading"
             :can-cancel="false"
             :is-full-page="false"
             :color="'#ffffff'"
             :background-color="'rgba(10, 31, 98, 0.9)'"
             loader="bars"
             aria-label="Loading content"/>

    <h1 class="history-page__title">{{ $t('history.title') }}</h1>
    <div v-if="drawHistory.length === 0" class="history-page__no-history" role="status">{{ $t('history.noHistory') }}</div>
    <div v-else class="history-page__list" role="table" aria-label="Draw History">
      <div class="history-page__header" role="row">
        <span role="columnheader">{{ $t('history.drawNumber') }}</span>
        <span role="columnheader">{{ $t('history.drawnNumbers') }}</span>
        <span role="columnheader">{{ $t('history.status') }}</span>
        <span role="columnheader">{{ $t('history.amount') }}</span>
        <span role="columnheader">{{ $t('history.actions') }}</span>
      </div>
      <div
        v-for="(draw, index) in drawHistory"
        :key="draw.id"
        @click="showDetails(draw)"
        class="history-page__item"
        role="row"
        :aria-label="$t('history.drawDetails', { number: drawHistory.length - index })"
      >
        <span role="cell">{{ drawHistory.length - index }}</span>
        <div class="history-page__numbers" role="cell">
          <span
            v-for="number in draw.drawnNumbers"
            :key="number"
            class="history-page__draw-number"
            :class="{ 'history-page__draw-number--winning': draw.playerBet.includes(number) }"
            :aria-label="number + (draw.playerBet.includes(number) ? ' (winning)' : '')"
          >
            {{ number }}
          </span>
        </div>
        <span
          class="history-page__status"
          :class="draw.totalWinnings > 0 ? 'history-page__status--won' : 'history-page__status--lost'"
          role="cell"
        >
          {{ draw.totalWinnings > 0 ? $t('history.won') : $t('history.lost') }}
        </span>
        <span role="cell">{{ draw.totalWinnings }}€</span>
        <button
          @click.stop="deleteDraw(draw.id)"
          class="history-page__delete-btn"
          role="cell"
          :aria-label="$t('history.deleteDraw', { number: drawHistory.length - index })"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
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
    const { t } = useI18n()
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
        toast.error(t('history.fetchError'))
      } finally {
        isLoading.value = false
      }
    }

    const deleteDraw = async (id) => {
      isLoading.value = true
      try {
        await deleteDoc(doc(db, 'drawHistory', id))
        drawHistory.value = drawHistory.value.filter(draw => draw.id !== id)
        toast.success(t('history.deleteSuccess'))
      } catch (error) {
        console.error('Error deleting draw:', error)
        toast.error(t('history.deleteError'))
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

<style lang="scss" scoped>
.history-page {
  padding: var(--spacing-lg);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border-radius: var(--border-radius-md);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  &__title {
    margin-bottom: var(--spacing-lg);
    font-size: var(--font-size-xl);
    color: var(--color-secondary);
    text-align: center;
  }

  &__no-history {
    text-align: center;
    margin-top: var(--spacing-lg);
    font-size: var(--font-size-lg);
    color: var(--color-secondary);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  &__header,
  &__item {
    display: grid;
    grid-template-columns: 0.5fr 2fr 0.5fr 0.5fr 0.5fr;
    align-items: center;
    padding: var(--spacing-md);
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-sm);
    transition: all var(--transition-default);

    @media (max-width: 768px) {
      grid-template-columns: 1fr 2fr 1fr;
      gap: var(--spacing-sm);
    }
  }

  &__header {
    background-color: var(--color-primary);
    color: white;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: 1px solid var(--color-secondary);
    border-radius: var(--border-radius-sm);
    @media (max-width: 768px) {
      display: none;
    }
  }

  &__item {
    background-color: rgba(255, 255, 255, 0.05);
    cursor: pointer;
    backdrop-filter: blur(5px);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      background-color: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 768px) {
      grid-template-areas:
        "number numbers numbers"
        "status amount actions";

      > :nth-child(1) { grid-area: number; }
      > :nth-child(2) { grid-area: numbers; }
      > :nth-child(3) { grid-area: status; }
      > :nth-child(4) { grid-area: amount; }
      > :nth-child(5) { grid-area: actions; }
    }
  }

  &__numbers {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  &__draw-number {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    border: 2px solid var(--color-secondary);
    border-radius: 50%;
    font-weight: bold;
    transition: all 0.3s ease;

    &--winning {
      background-color: var(--color-success);
      color: var(--bg-primary);
      border-color: var(--color-success);
      transform: scale(1.1);
    }
  }

  &__status {
    font-weight: bold;
    text-transform: uppercase;

    &--won {
      color: var(--color-success);
    }

    &--lost {
      color: var(--color-danger);
    }
  }

  &__delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: var(--font-size-lg);
    color: var(--color-danger);
    transition: transform 0.2s ease;
    text-align: left;
    &:hover {
      transform: scale(1.2);
    }
  }
}

:deep(.vl-overlay) {
  background-color: rgba(10, 31, 98, 0.9) !important;
}

:deep(.vl-icon) {
  stroke: var(--color-white) !important;
}

:deep(.vl-backdrop) {
  backdrop-filter: blur(5px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.history-page {
  animation: fadeIn 0.5s ease-out;
}
</style>
