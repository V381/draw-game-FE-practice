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

  <style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-index-modal);
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background-color: var(--bg-primary);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  max-width: 400px;
  width: 90%;
  position: relative;
  color: var(--text-primary);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
}

.modal-close {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background: none;
  border: none;
  font-size: var(--font-size-xl);
  cursor: pointer;
  color: var(--text-primary);
  transition: all var(--transition-default);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    color: var(--color-danger);
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-secondary);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

// Add styles for the modal content
:slotted(h2) {
  font-size: var(--font-size-lg);
  color: var(--color-secondary);
  margin-bottom: var(--spacing-md);
}

:slotted(p) {
  font-size: var(--font-size-md);
  line-height: 1.5;
  margin-bottom: var(--spacing-md);
}

:slotted(button) {
  background-color: var(--color-secondary);
  color: var(--bg-primary);
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: all var(--transition-default);

  &:hover {
    background-color: var(--bg-secondary);
    transform: translateY(-2px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-secondary);
  }
}
  </style>
