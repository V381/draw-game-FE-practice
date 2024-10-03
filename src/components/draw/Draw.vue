<template>
  <div class="draw-page">
    <h1 class="draw-page__title">Lottery Draw</h1>
    <div class="draw-page__container">
      <div class="draw-page__section draw-page__section--drawn">
        <h2 class="draw-page__subtitle">Drawn Numbers</h2>
        <div class="draw-page__numbers">
          <span
            v-for="(number, index) in drawnNumbers"
            :key="index"
            :class="['draw-page__number', {
              'draw-page__number--matched': userNumbers.includes(number)
            }]"
          >
            {{ number }}
          </span>
        </div>
      </div>
      <div class="draw-page__section draw-page__section--user">
        <h2 class="draw-page__subtitle">Your Numbers</h2>
        <div class="draw-page__numbers">
          <span
            v-for="number in userNumbers"
            :key="number"
            :class="['draw-page__number', {
              'draw-page__number--matched': matchedNumbers.includes(number),
              'draw-page__number--winning': isWinning && matchedNumbers.length >= 3
            }]"
          >
            {{ number }}
          </span>
        </div>
      </div>
    </div>
    <div class="draw-page__winnings">
      <h2 class="draw-page__winnings-title">Total Winnings: {{ totalWinnings }}€</h2>
      <div v-if="isWinning" class="draw-page__winnings-details">
        <p>You have matched {{ matchedNumbers.length }} number(s)!</p>
        <ul class="draw-page__winnings-list">
          <li v-if="matchedNumbers.length === 3">3 matches: 5€</li>
          <li v-else-if="matchedNumbers.length === 4">4 matches: 10€</li>
          <li v-else-if="matchedNumbers.length === 5">5 matches: 20€</li>
        </ul>
      </div>
      <div class="draw-page__winning-table">
        <h2 class="draw-page__subtitle">Winning Table</h2>
        <table class="draw-page__table">
          <thead>
            <tr>
              <th>Matching Numbers</th>
              <th>Prize</th>
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
    <Modal v-model="showModal">
      <h2>Draw Completed!</h2>
      <p v-if="totalWinnings > 0">Congratulations! You won {{ totalWinnings }}€.</p>
      <p v-else>Sorry, you didn't win this time.</p>
      <div class="modal-buttons">
        <button @click="saveToHistory" class="modal-button">Save to History</button>
        <button @click="goToHome" class="modal-button">Go Back to Action</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import Modal from '@/components/common/Modal.vue'
export default {
  name: 'DrawPage',
  components: {
    Modal
  },
  setup () {
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
        const answer = window.confirm('The draw is in progress. Are you sure you want to leave?')
        if (answer) {
          next()
        } else {
          next(false)
        }
      } else {
        next()
      }
    })

    const saveToHistory = () => {
      const history = JSON.parse(localStorage.getItem('drawHistory')) || []
      const newEntry = {
        timestamp: new Date().toLocaleString(),
        drawnNumbers: drawnNumbers.value,
        playerBet: userNumbers,
        totalWinnings: totalWinnings.value
      }
      history.push(newEntry)
      localStorage.setItem('drawHistory', JSON.stringify(history))
      alert('Draw saved to history!')
    }

    const goToHome = () => {
      router.push({ name: 'Home' })
    }

    onMounted(() => {
      startDraw()
    })

    // Fisher-Yates Shuffle Algorithm
    const shuffleArray = (array) => {
      const arr = [...array]
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    }

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
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #005baa;
  color: white;
}

.draw-page__title {
  font-size: 32px;
  color: #005baa;
}

.draw-page__container {
  display: flex;
  gap: 50px;
  margin-top: 20px;
  width: 100%;
  max-width: 800px;
}

.draw-page__section {
  flex: 1;
}

.draw-page__subtitle {
  font-size: 24px;
  margin-bottom: 10px;
  color: white;
}

.draw-page__numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.draw-page__number {
  width: 50px;
  height: 50px;
  font-size: 16px;
  cursor: default;
  border: 2px solid #00aeef;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  transition: background-color 0.3s, color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.draw-page__number--matched {
  background-color: #4caf50;
  color: white;
}

.draw-page__number--winning {
  background-color: #ff9800;
  color: white;
}

.draw-page__winnings {
  margin-top: 40px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  width: 100%;
  max-width: 800px;
}

.draw-page__winnings-title {
  margin-bottom: 10px;
  color: white;
  text-align: center;
}

.draw-page__winnings-details {
  margin-top: 10px;
  font-size: 18px;
  color: white;
  text-align: center;
}

.draw-page__winnings-list {
  list-style: none;
  padding: 0;
}

.draw-page__winnings-list li {
  margin: 5px 0;
}

.draw-page__winning-table {
  margin-top: 40px;
  width: 100%;
  max-width: 800px;
}

.draw-page__table {
  width: 100%;
  border-collapse: collapse;
  color: white;
}

.draw-page__table th,
.draw-page__table td {
  border: 1px solid #00aeef;
  padding: 10px;
  text-align: center;
}

.draw-page__table th {
  background-color: rgba(0, 174, 239, 0.2);
}

.draw-page__table tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.1);
}
.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.modal-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #00aeef;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #008ecc;
  }
}
</style>
