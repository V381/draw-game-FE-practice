<template>
    <Teleport to="body">
      <div v-if="modelValue" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeModal">&times;</button>
          <slot></slot>
        </div>
      </div>
    </Teleport>
  </template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Modal-v',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const closeModal = () => {
      emit('update:modelValue', false)
    }

    return {
      closeModal
    }
  }
})
</script>

  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
    position: relative;
  }

  .modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }
  </style>
