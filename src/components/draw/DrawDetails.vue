<template>
  <div class="draw-details" role="main">
    <loading v-model:active="isLoading"
             :can-cancel="false"
             :is-full-page="false"
             :color="'#ffffff'"
             :background-color="'rgba(10, 31, 98, 0.9)'"
             loader="bars"
             aria-label="Loading draw details"/>
    <h1 class="draw-details__title">{{ $t('drawDetails.title') }}</h1>
    <table v-if="draw" class="draw-details__table" aria-labelledby="draw-details-title">
      <tbody>
        <tr>
          <th scope="row">{{ $t('drawDetails.drawDate') }}</th>
          <td>{{ formatDate(draw.timestamp) }}</td>
        </tr>
        <tr>
          <th scope="row">{{ $t('drawDetails.drawNumber') }}</th>
          <td>{{ draw.id }}</td>
        </tr>
        <tr>
          <th scope="row">{{ $t('drawDetails.playerBetNumbers') }}</th>
          <td>
            <div class="draw-details__numbers" role="list" aria-label="Player bet numbers">
              <span
                v-for="number in draw.playerBet"
                :key="number"
                class="draw-details__number"
                :class="{ 'draw-details__number--winning': draw.drawnNumbers.includes(number) }"
                role="listitem"
                :aria-label="number + (draw.drawnNumbers.includes(number) ? ', winning number' : '')"
              >
                {{ number }}
              </span>
            </div>
          </td>
        </tr>
        <tr>
          <th scope="row">{{ $t('drawDetails.drawnNumbers') }}</th>
          <td>
            <div class="draw-details__numbers" role="list" aria-label="Drawn numbers">
              <span
                v-for="number in draw.drawnNumbers"
                :key="number"
                class="draw-details__number"
                role="listitem"
              >
                {{ number }}
              </span>
            </div>
          </td>
        </tr>
        <tr>
          <th scope="row">{{ $t('drawDetails.status') }}</th>
          <td :class="draw.totalWinnings > 0 ? 'draw-details__status--won' : 'draw-details__status--lost'">
            {{ draw.totalWinnings > 0 ? $t('drawDetails.won') : $t('drawDetails.lost') }}
          </td>
        </tr>
        <tr>
          <th scope="row">{{ $t('drawDetails.totalAmountWon') }}</th>
          <td>{{ draw.totalWinnings }}€</td>
        </tr>
      </tbody>
    </table>
    <button @click="goBack" class="draw-details__back-btn">{{ $t('drawDetails.goBack') }}</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

export default {
  name: 'DrawDetails',
  components: {
    Loading
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const draw = ref(null)
    const isLoading = ref(true)

    const fetchDrawDetails = async () => {
      isLoading.value = true
      try {
        const docRef = doc(db, 'drawHistory', route.params.id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          draw.value = { id: docSnap.id, ...docSnap.data() }
        } else {
          console.log(t('drawDetails.noSuchDocument'))
        }
      } catch (error) {
        console.error(t('drawDetails.errorFetchingDrawDetails'), error)
      } finally {
        isLoading.value = false
      }
    }

    const formatDate = (timestamp) => {
      return new Date(timestamp).toLocaleString()
    }

    const goBack = () => {
      router.push({ name: 'History' })
    }

    onMounted(fetchDrawDetails)

    return {
      draw,
      formatDate,
      goBack,
      isLoading
    }
  }
}
</script>

<style scoped lang="scss">
.draw-details {
  padding: var(--spacing-md);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  align-items: center;

  &__title {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-md);
    text-align: center;
  }

  &__table {
    width: 100%;
    max-width: 600px;
    border-collapse: collapse;
    margin-top: var(--spacing-md);

    th,
    td {
      border: 1px solid var(--border-primary);
      padding: var(--spacing-sm);
      text-align: left;
    }

    th {
      background-color: var(--bg-secondary);
      width: 40%;
    }

    tr:nth-child(even) {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  &__numbers {
    display: flex;
    flex-wrap: wrap;
  }

  &__number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    font-size: var(--font-size-sm);
    border: 1px solid var(--border-primary);
    border-radius: 50%;
    margin: var(--spacing-xs);
    background-color: var(--bg-secondary);

    &--winning {
      background-color: var(--bg-success);
    }
  }

  &__status {
    &--won {
      color: var(--color-success);
      font-weight: bold;
    }

    &--lost {
      color: var(--color-danger);
      font-weight: bold;
    }
  }

  &__back-btn {
    margin-top: var(--spacing-md);
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    font-size: var(--font-size-md);
    transition: background-color var(--transition-default);

    &:hover {
      background-color: var(--bg-primary);
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
</style>
