<template>
    <div class="lottery">
      <div class="lottery__board">
        <h2 class="lottery__title">Select 5 Numbers</h2>
        <div class="lottery__numbers">
          <button
            v-for="number in numbers"
            :key="number"
            :class="['lottery__number-button', { 'lottery__number-button--selected': isSelected(number) }]"
            @click="toggleNumber(number)"
            :disabled="!isSelected(number) && selectedNumbers.length >= 5"
          >
            {{ number }}
          </button>
        </div>
      </div>
      <div class="lottery__selection">
        <h2 class="lottery__title">Selected Numbers</h2>
        <div class="lottery__selected-list">
          <div
            v-for="number in selectedNumbers"
            :key="number"
            class="lottery__selected-item"
          >
            <span>{{ number }}</span>
            <button class="lottery__delete-button" @click="removeNumber(number)">✕</button>
          </div>
        </div>
        <button
          class="lottery__submit-button"
          :disabled="selectedNumbers.length !== 5"
          @click="submitBet"
        >
          Submit Bet
        </button>
      </div>
    </div>
  </template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'LotteryGame',
  setup () {
    const numbers = ref(Array.from({ length: 30 }, (_, i) => i + 1))
    const selectedNumbers = ref([])
    const router = useRouter()

    const isSelected = (number) => selectedNumbers.value.includes(number)

    const toggleNumber = (number) => {
      if (isSelected(number)) {
        removeNumber(number)
      } else {
        if (selectedNumbers.value.length < 5) {
          selectedNumbers.value.push(number)
        }
      }
    }

    const removeNumber = (number) => {
      selectedNumbers.value = selectedNumbers.value.filter(n => n !== number)
    }

    const submitBet = () => {
      router.push({ name: 'Draw', query: { numbers: selectedNumbers.value.join(',') } })
    }

    return {
      numbers,
      selectedNumbers,
      isSelected,
      toggleNumber,
      removeNumber,
      submitBet
    }
  }
}
</script>

  <style scoped>
  .lottery {
    display: flex;
    padding: 20px;
    gap: 40px;
    background-color: #005baa;
    color: white;
  }

  .lottery__board,
  .lottery__selection {
    flex: 1;
  }

  .lottery__title {
    margin-bottom: 10px;
  }

  .lottery__numbers {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .lottery__number-button {
    width: 50px;
    height: 50px;
    font-size: 16px;
    cursor: pointer;
    border: 2px solid #00aeef;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    transition: background-color 0.3s, color 0.3s;
  }

  .lottery__number-button--selected {
    background-color: #00aeef;
    color: #005baa;
  }

  .lottery__number-button:disabled {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.2);
    cursor: not-allowed;
  }

  .lottery__selected-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
  }

  .lottery__selected-item {
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.1);
    padding: 5px 10px;
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .lottery__delete-button {
    background: none;
    border: none;
    color: #ff6b6b;
    margin-left: 5px;
    cursor: pointer;
    font-size: 16px;
  }

  .lottery__submit-button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s;
  }

  .lottery__submit-button:disabled {
    background-color: rgba(255, 255, 255, 0.2);
    cursor: not-allowed;
  }
  </style>
