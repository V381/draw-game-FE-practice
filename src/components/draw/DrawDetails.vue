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
  padding: var(--spacing-lg);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: var(--border-radius-md);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;

  &__title {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-lg);
    text-align: center;
    color: var(--color-secondary);
  }

  &__table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 var(--spacing-sm);
    margin-top: var(--spacing-md);

    th,
    td {
      padding: var(--spacing-md);
      text-align: left;
      border-radius: var(--border-radius-sm);
    }

    th {
      background-color: var(--color-primary);
      color: white;
      font-weight: bold;
      border-right: none;
      width: 40%;
    }

    td {
      background-color: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(5px);
    }

    tr {
      transition: all var(--transition-default);

      &:hover td {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  &__numbers {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    justify-content: flex-start;
  }

  &__number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    font-size: var(--font-size-md);
    border: 2px solid var(--color-secondary);
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    transition: all var(--transition-default);

    &--winning {
      background-color: var(--color-success);
      color: var(--bg-primary);
      border-color: var(--color-success);
      transform: scale(1.1);
      font-weight: bold;
    }
  }

  &__status {
    &--won,
    &--lost {
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    &--won {
      color: var(--color-success);
    }

    &--lost {
      color: var(--color-danger);
    }
  }

  &__back-btn {
    margin-top: var(--spacing-lg);
    padding: var(--spacing-md) var(--spacing-lg);
    background-color: var(--color-secondary);
    color: var(--bg-primary);
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    font-size: var(--font-size-md);
    font-weight: bold;
    transition: all var(--transition-default);
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &:hover {
      background-color: var(--bg-secondary);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

.draw-details {
  animation: fadeIn 0.5s ease-out;
}

@media (max-width: 600px) {
  .draw-details {
    padding: var(--spacing-md);

    &__table {
      th,
      td {
        display: block;
        width: 100%;
      }

      th {
        text-align: center;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }

      td {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        text-align: center;
      }
    }

    &__numbers {
      justify-content: center;
    }
  }
}
</style>
