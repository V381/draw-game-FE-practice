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
  z-index: var(--z-index-modal);
}

.modal-content {
  background-color: var(--color-white);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  max-width: 400px;
  width: 90%;
  position: relative;
  color: var(--text-secondary);
}

.modal-close {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background: none;
  border: none;
  font-size: var(--font-size-xl);
  cursor: pointer;
  color: var(--text-secondary);
  transition: color var(--transition-default);

  &:hover {
    color: var(--color-danger);
  }
}
  </style>
