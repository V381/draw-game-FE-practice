<template>
  <div class="lottery">
    <div class="lottery__board">
      <h2 class="lottery__title">{{ $t('lottery.title') }}</h2>
      <div class="lottery__numbers">
        <button
          v-for="number in numbers"
          :key="number"
          :class="['lottery__number-button', { 'lottery__number-button--selected': isSelected(number) }]"
          @click="toggleNumber(number)"
          :disabled="!isSelected(number) && selectedNumbers.length >= 5"
          :aria-label="$t('lottery.numberButton', { number })"
        >
          {{ number }}
        </button>
      </div>
    </div>
    <div class="lottery__selection">
      <h2 class="lottery__title">{{ $t('lottery.selectedNumbers') }}</h2>
      <div class="lottery__selected-list">
        <div
          v-for="number in selectedNumbers"
          :key="number"
          class="lottery__selected-item"
        >
          <span>{{ number }}</span>
          <button
            class="lottery__delete-button"
            @click="removeNumber(number)"
            :aria-label="$t('lottery.removeNumber', { number })"
          >✕</button>
        </div>
      </div>
      <button
        class="lottery__submit-button"
        :disabled="selectedNumbers.length !== 5"
        @click="submitBet"
      >
        {{ $t('lottery.submitBet') }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default {
  name: 'LotteryGame',
  setup () {
    const { t } = useI18n()
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
      sessionStorage.setItem('selectedNumbers', JSON.stringify(selectedNumbers.value))
      sessionStorage.setItem('betSubmitted', 'true')
      router.push({ name: 'draw', query: { numbers: selectedNumbers.value.join(',') } })
    }

    return {
      numbers,
      selectedNumbers,
      isSelected,
      toggleNumber,
      removeNumber,
      submitBet,
      t
    }
  }
}
</script>

  <style lang="scss" scoped>
.lottery {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  gap: 2rem;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border-radius: var(--border-radius-md);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    flex-direction: row;
  }

  &__board,
  &__selection {
    flex: 1;
    background-color: rgba(255, 255, 255, 0.1);
    padding: 1.5rem;
    border-radius: var(--border-radius-md);
    backdrop-filter: blur(10px);
  }

  &__title {
    font-size: var(--font-size-lg);
    margin-bottom: 1.5rem;
    text-align: center;
    color: var(--color-secondary);
  }

  &__numbers {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 0.75rem;
  }

  &__number-button {
    width: 100%;
    aspect-ratio: 1;
    font-size: var(--font-size-md);
    cursor: pointer;
    border: 2px solid var(--color-secondary);
    border-radius: var(--border-radius-sm);
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    &--selected {
      background-color: var(--color-secondary);
      color: var(--bg-primary);
      font-weight: bold;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__selected-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  &__selected-item {
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.1);
    border: 2px solid var(--color-secondary);
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius-sm);
    font-weight: bold;
    color: white;
  }

  &__delete-button {
    background: none;
    border: none;
    color: var(--color-danger);
    margin-left: 0.5rem;
    cursor: pointer;
    font-size: var(--font-size-md);
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.2);
    }
  }

  &__submit-button {
    width: 100%;
    padding: 1rem;
    font-size: var(--font-size-md);
    cursor: pointer;
    background-color: var(--color-success);
    color: var(--text-primary);
    border: none;
    border-radius: var(--border-radius-md);
    transition: all 0.3s ease;
    font-weight: bold;

    &:hover:not(:disabled) {
      background-color: darken(#4caf50, 10%);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    &:disabled {
      background-color: rgba(255, 255, 255, 0.2);
      cursor: not-allowed;
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.lottery {
  animation: fadeIn 0.5s ease-out;
}
  </style>
