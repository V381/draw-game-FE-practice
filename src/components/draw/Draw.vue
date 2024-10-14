<template>
  <div class="draw-page" role="main">
    <h1 class="draw-page__title">{{ $t('lottery.drawTitle') }}</h1>
    <div class="draw-page__container">
      <div class="draw-page__section draw-page__section--drawn">
        <h2 class="draw-page__subtitle">{{ $t('lottery.drawnNumbers') }}</h2>
        <div class="draw-page__numbers" role="list" aria-label="Drawn numbers">
          <span
            v-for="(number, index) in drawnNumbers"
            :key="index"
            :class="['draw-page__number', {
              'draw-page__number--matched': userNumbers.includes(number)
            }]"
            role="listitem"
            :aria-label="number + (userNumbers.includes(number) ? ', matched' : '')"
          >
            {{ number }}
          </span>
        </div>
      </div>
      <div class="draw-page__section draw-page__section--user">
        <h2 class="draw-page__subtitle">{{ $t('lottery.yourNumbers') }}</h2>
        <div class="draw-page__numbers" role="list" aria-label="Your numbers">
          <span
            v-for="number in userNumbers"
            :key="number"
            :class="['draw-page__number', {
              'draw-page__number--matched': matchedNumbers.includes(number),
              'draw-page__number--winning': isWinning && matchedNumbers.length >= 3
            }]"
            role="listitem"
            :aria-label="number + (matchedNumbers.includes(number) ? ', matched' : '')"
          >
            {{ number }}
          </span>
        </div>
      </div>
    </div>
    <div class="draw-page__winnings">
      <h2 class="draw-page__winnings-title">{{ $t('lottery.totalWinnings', { amount: totalWinnings }) }}</h2>
      <div v-if="isWinning" class="draw-page__winnings-details">
        <p>{{ $t('lottery.matchedNumbers', { count: matchedNumbers.length }) }}</p>
        <ul class="draw-page__winnings-list" aria-label="Winnings details">
          <li v-if="matchedNumbers.length === 3">{{ $t('lottery.threeMatches') }}</li>
          <li v-else-if="matchedNumbers.length === 4">{{ $t('lottery.fourMatches') }}</li>
          <li v-else-if="matchedNumbers.length === 5">{{ $t('lottery.fiveMatches') }}</li>
        </ul>
      </div>
      <div class="draw-page__winning-table">
        <h2 class="draw-page__subtitle">{{ $t('lottery.winningTable') }}</h2>
        <table class="draw-page__table" aria-label="Winning table">
          <thead>
            <tr>
              <th scope="col">{{ $t('lottery.matchingNumbers') }}</th>
              <th scope="col">{{ $t('lottery.prize') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>3</td>
              <td>5€</td>
            </tr>
            <tr>
              <td>4</td>
              <td>10€</td>
            </tr>
            <tr>
              <td>5</td>
              <td>20€</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Modal v-model="showModal" aria-labelledby="modal-title">
      <h2 id="modal-title">{{ $t('lottery.drawCompleted') }}</h2>
      <p v-if="totalWinnings > 0">{{ $t('lottery.congratulations', { amount: totalWinnings }) }}</p>
      <p v-else>{{ $t('lottery.betterLuckNextTime') }}</p>
      <div class="modal-buttons">
        <button @click="saveToHistory" class="modal-button">{{ $t('lottery.saveToHistory') }}</button>
        <button @click="goToHome" class="modal-button">{{ $t('lottery.goBackToAction') }}</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Modal from '@/components/common/Modal.vue'
import shuffleArray from '@/utils/shuffleArray'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export default {
  name: 'DrawPage',
  components: {
    Modal
  },
  setup () {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const showModal = ref(false)
    const selectedNumbers = ref([])
    const selectedNumbersFromStorage = sessionStorage.getItem('selectedNumbers')
    if (selectedNumbersFromStorage) {
      selectedNumbers.value = JSON.parse(selectedNumbersFromStorage)
    }

    if (selectedNumbers.value.length === 0) {
      const numbersQuery = route.query.numbers
      if (numbersQuery) {
        selectedNumbers.value = numbersQuery.split(',').map(Number)
      }
    }

    const userNumbers = selectedNumbers.value

    const drawnNumbers = ref([])
    const matchedNumbers = ref([])
    const isWinning = ref(false)
    const totalWinnings = ref(0)
    const isDrawComplete = ref(false)
    const hasStartedDraw = ref(false)

    const winningsTable = {
      3: 5,
      4: 10,
      5: 20
    }

    const startDraw = () => {
      if (hasStartedDraw.value) return
      hasStartedDraw.value = true
      setTimeout(() => {
        drawNumbers()
      }, 3000)
    }

    const drawNumbers = async () => {
      const allNumbers = Array.from({ length: 30 }, (_, i) => i + 1)
      const shuffled = shuffleArray(allNumbers)
      const selectedDrawn = []

      for (let i = 0; i < 5; i++) {
        const number = shuffled[i]
        selectedDrawn.push(number)
        drawnNumbers.value = [...selectedDrawn]

        if (userNumbers.includes(number)) {
          if (!matchedNumbers.value.includes(number)) {
            matchedNumbers.value.push(number)
            calculateWinnings(matchedNumbers.value.length)
          }
        }

        await delay(4000)
      }

      if (matchedNumbers.value.length >= 3) {
        isWinning.value = true
      }

      console.log('Draw completed, setting isDrawComplete to true')
      isDrawComplete.value = true
      showModal.value = true

      console.log('Attempting to open modal')
      sessionStorage.removeItem('betSubmitted')
      sessionStorage.removeItem('selectedNumbers')
    }

    const calculateWinnings = (matches) => {
      if (winningsTable[matches]) {
        totalWinnings.value = winningsTable[matches]
      }
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    onBeforeRouteLeave((to, from, next) => {
      if (!isDrawComplete.value) {
        const answer = window.confirm(t('lottery.confirmLeave'))
        if (answer) {
          next()
        } else {
          next(false)
        }
      } else {
        next()
      }
    })

    const saveToHistory = async () => {
      const history = JSON.parse(localStorage.getItem('drawHistory')) || []
      try {
        const newEntry = {
          timestamp: new Date().toISOString(),
          drawnNumbers: drawnNumbers.value,
          playerBet: userNumbers,
          totalWinnings: totalWinnings.value
        }
        console.log('New entry to be saved:', newEntry)

        // Add to Firestore
        const docRef = await addDoc(collection(db, 'drawHistory'), newEntry)
        console.log('Document written with ID: ', docRef.id)

        // Update local history
        history.push(newEntry)
        localStorage.setItem('drawHistory', JSON.stringify(history))

        alert(t('lottery.savedToHistory'))
        goToHome()
      } catch (error) {
        console.error('Error saving to history:', error)
        alert(t('lottery.failedToSave', { error: error.message }))
      }
    }

    const goToHome = () => {
      router.push({ name: 'Home' })
    }

    onMounted(() => {
      startDraw()
    })

    return {
      drawnNumbers,
      userNumbers,
      matchedNumbers,
      isWinning,
      totalWinnings,
      saveToHistory,
      goToHome,
      showModal
    }
  }
}
</script>

<style scoped lang="scss">
.draw-page {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;

  &__title {
    font-size: var(--font-size-xl);
    color: var(--color-secondary);
    margin-bottom: var(--spacing-lg);
    text-align: center;
  }

  &__container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    margin-top: var(--spacing-md);
    width: 100%;
    max-width: 800px;

    @media (min-width: 768px) {
      flex-direction: row;
    }
  }

  &__section {
    flex: 1;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    backdrop-filter: blur(10px);
    transition: all var(--transition-default);

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
  }

  &__subtitle {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-md);
    color: var(--color-secondary);
    text-align: center;
  }

  &__numbers {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    justify-content: center;
  }

  &__number {
    width: 60px;
    height: 60px;
    font-size: var(--font-size-md);
    cursor: default;
    border: 2px solid var(--color-secondary);
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;

    &--matched {
      background-color: var(--color-success);
      color: var(--bg-primary);
      border-color: var(--color-success);
      transform: scale(1.1);
    }

    &--winning {
      background-color: var(--color-warning);
      color: var(--bg-primary);
      border-color: var(--color-warning);
      animation: pulse 1.5s infinite;
    }
  }

  &__winnings {
    margin-top: var(--spacing-lg);
    width: 100%;
    max-width: 800px;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    backdrop-filter: blur(10px);
  }

  &__winnings-title {
    font-size: var(--font-size-lg);
    color: var(--color-secondary);
    text-align: center;
    margin-bottom: var(--spacing-md);
  }

  &__winnings-details {
    font-size: var(--font-size-md);
    color: var(--text-primary);
    text-align: center;
  }

  &__winnings-list {
    list-style: none;
    padding: 0;
    margin-top: var(--spacing-sm);
  }

  &__winning-table {
    margin-top: var(--spacing-lg);
    width: 100%;
  }

  &__table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    color: var(--text-primary);

    th, td {
      border: 1px solid var(--color-secondary);
      padding: var(--spacing-sm);
      text-align: center;
    }

    th {
      background-color: rgba(0, 174, 239, 0.2);
      color: var(--color-secondary);
      font-weight: bold;
    }

    tr:nth-child(even) {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.modal-button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-sm);
  background-color: var(--color-secondary);
  color: var(--bg-primary);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: all var(--transition-default);
  font-weight: bold;

  &:hover {
    background-color: var(--bg-secondary);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.draw-page {
  animation: fadeIn 0.5s ease-out;
}
</style>
