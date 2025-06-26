<template>
  <transition name="fade-bg">
    <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center">
      <transition name="fade">
        <div v-if="visible" class="absolute inset-0 bg-black bg-opacity-60"></div>
      </transition>
      <transition name="pop-fade">
        <div 
          v-if="modalVisible" 
          class="relative flex items-center justify-center pop-card z-10"
        >
          <img 
            src="/assets/ui-assets/delete-box.svg" 
            alt="Delete Confirmation Box" 
            class="max-w-md max-h-96"
          />
          <!-- Modal content -->
          <div class="absolute inset-0 flex flex-col items-center justify-center p-8">
            <h2 class="text-3xl font-bold mb-4 text-center text-black" style="font-family: var(--main-font);">
              Delete Recipe?
            </h2>
            <p class="text-lg text-center mb-6 text-black">
              Are you sure you want to delete <span class="text-red-600 font-bold">{{ recipeName }}</span>?
            </p>
            <div class="flex space-x-4">
              <button 
                @click="confirmDelete"
                class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button 
                @click="cancel"
                class="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'DeleteConfirmationModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    recipeName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      modalVisible: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        // Fade in background, then pop in modal
        requestAnimationFrame(() => {
          setTimeout(() => {
            this.modalVisible = true
          }, 120) // Delay for bg fade
        })
      } else {
        this.modalVisible = false
      }
    }
  },
  methods: {
    confirmDelete() {
      this.$emit('confirm')
      this.closeModal()
    },
    cancel() {
      this.$emit('cancel')
      this.closeModal()
    },
    closeModal() {
      this.modalVisible = false
      setTimeout(() => {
        this.$emit('close')
      }, 120)
    }
  }
}
</script>

<style scoped>
.fade-bg-enter-active, .fade-bg-leave-active {
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-bg-enter-from, .fade-bg-leave-to {
  opacity: 0;
}
.fade-bg-enter-to, .fade-bg-leave-from {
  opacity: 1;
}

.fade-enter-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-leave-active {
  transition: opacity 0s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.pop-fade-enter-active {
  animation: pop-in-smooth 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.pop-fade-leave-active {
  animation: bubble-burst 0.4s ease-in forwards;
}
.pop-fade-enter-from, .pop-fade-leave-to {
  opacity: 0;
  transform: scale(0.7) translateY(40px);
}
.pop-fade-enter-to, .pop-fade-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

@keyframes pop-in-smooth {
  0% {
    opacity: 0;
    transform: scale(0.7) translateY(40px);
  }
  60% {
    opacity: 1;
    transform: scale(1.06) translateY(-6px);
  }
  80% {
    transform: scale(0.98) translateY(1.5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes bubble-burst {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.4);
  }
}

.pop-card {
  transition: box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
</style> 