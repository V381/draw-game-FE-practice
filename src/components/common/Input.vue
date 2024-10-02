<template>
    <div class="input-field">
      <label v-if="label" :for="inputId" class="input-field__label">{{ label }}</label>
      <input
        :id="inputId"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        :class="{
          'input-field__input--error': error,
          'input-field__input--valid': isValid
        }"
        class="input-field__input"
        @input="handleInput"
        @blur="handleBlur"
      />
      <p v-if="error" class="input-field__error">{{ error }}</p>
    </div>
  </template>

<script>

export default {
  name: 'InputField',
  props: {
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    },
    inputId: {
      type: String,
      default: ''
    },
    isValid: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'blur'],
  setup (props, { emit }) {
    const handleInput = (event) => {
      emit('update:modelValue', event.target.value)
    }

    const handleBlur = (event) => {
      emit('blur', event.target.value)
    }

    return {
      handleInput,
      handleBlur
    }
  }
}
</script>

  <style lang="scss" scoped>
  .input-field {
    display: flex;
    flex-direction: column;
    &__label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: #555555;
    }
    &__input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #cccccc;
      border-radius: 8px;
      font-size: 1rem;
      background-color: #ffffff;
      color: #333333;
      box-sizing: border-box;
      transition: all 0.3s ease;

      &::placeholder {
        color: #999999;
      }

      &:focus {
        outline: none;
        border-color: #00B0FF;
        box-shadow: 0 0 0 3px rgba(0, 176, 255, 0.1);
      }
      &--error {
        border-color: #ff4d4f;
      }
      &--valid {
        border-color: #52c41a;
      }
    }
    &__error {
      margin-top: 0.25rem;
      color: #ff4d4f;
      font-size: 0.875rem;
    }
  }
  </style>
