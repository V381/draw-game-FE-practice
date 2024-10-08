<template>
  <div class="draw-details">
    <h1 class="draw-details__title">Draw Details</h1>
    <table v-if="draw" class="draw-details__table">
      <tbody>
        <tr>
          <th>Draw Date</th>
          <td>{{ formatDate(draw.timestamp) }}</td>
        </tr>
        <tr>
          <th>Draw Number</th>
          <td>{{ draw.id }}</td>
        </tr>
        <tr>
          <th>Player Bet Numbers</th>
          <td>
            <div class="draw-details__numbers">
              <span
                v-for="number in draw.playerBet"
                :key="number"
                class="draw-details__number"
                :class="{ 'draw-details__number--winning': draw.drawnNumbers.includes(number) }"
              >
                {{ number }}
              </span>
            </div>
          </td>
        </tr>
        <tr>
          <th>Drawn Numbers</th>
          <td>
            <div class="draw-details__numbers">
              <span
                v-for="number in draw.drawnNumbers"
                :key="number"
                class="draw-details__number"
              >
                {{ number }}
              </span>
            </div>
          </td>
        </tr>
        <tr>
          <th>Status</th>
          <td :class="draw.totalWinnings > 0 ? 'draw-details__status--won' : 'draw-details__status--lost'">
            {{ draw.totalWinnings > 0 ? 'Won' : 'Lost' }}
          </td>
        </tr>
        <tr>
          <th>Total Amount Won</th>
          <td>{{ draw.totalWinnings }}€</td>
        </tr>
      </tbody>
    </table>
    <button @click="goBack" class="draw-details__back-btn">Go Back</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export default {
  name: 'DrawDetails',
  setup () {
    const route = useRoute()
    const router = useRouter()
    const draw = ref(null)

    const fetchDrawDetails = async () => {
      const docRef = doc(db, 'drawHistory', route.params.id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        draw.value = { id: docSnap.id, ...docSnap.data() }
      } else {
        console.log('No such document!')
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
      goBack
    }
  }
}
</script>

<style scoped>
.draw-details {
  padding: 20px;
  background-color: #005baa;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.draw-details__title {
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
}

.draw-details__table {
  width: 100%;
  max-width: 600px;
  border-collapse: collapse;
  margin-top: 20px;
}

.draw-details__table th,
.draw-details__table td {
  border: 1px solid #0077be;
  padding: 12px;
  text-align: left;
}

.draw-details__table th {
  background-color: #003366;
  width: 40%;
}

.draw-details__table tr:nth-child(even) {
  background-color: #0068c3;
}

.draw-details__numbers {
  display: flex;
  flex-wrap: wrap;
}

.draw-details__number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  font-size: 14px;
  border: 1px solid white;
  border-radius: 50%;
  margin: 2px;
  background-color: #0077be;
}

.draw-details__number--winning {
  background-color: #4caf50;
}

.draw-details__status--won {
  color: #4caf50;
  font-weight: bold;
}

.draw-details__status--lost {
  color: #f44336;
  font-weight: bold;
}

.draw-details__back-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #003366;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.draw-details__back-btn:hover {
  background-color: #002244;
}
</style>
