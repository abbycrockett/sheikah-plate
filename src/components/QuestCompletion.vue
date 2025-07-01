<template>
    <transition name="quest-completion">
      <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Background overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-60"></div>
        
        <!-- Quest completion image -->
        <div class="relative z-10 flex items-center justify-center">
          <img 
            :src="questImage" 
            alt="Quest Completion" 
            class="max-w-full max-h-full object-contain"
          />
          
          <!-- Complete badge - positioned further to the right of center -->
          <div class="absolute top-1/2 left-1/2 transform -translate-y-7 translate-x-64">
            <img 
              v-if="visible"
              :src="`${basePath}/assets/ui-assets/complete.png`"
              alt="Complete" 
              class="w-40 h-40 object-contain complete-badge"
            />
          </div>
          
          <!-- Close button -->
          <button 
            @click="close"
            class="absolute top-4 right-4 w-8 h-8 bg-red-500/80 hover:bg-red-600/90 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  import { watch, computed } from 'vue';
  
  export default {
    name: 'QuestCompletion',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      questId: {
        type: String,
        default: 'quest-1'
      }
    },
    emits: ['close'],
    setup(props, { emit }) {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const basePath = isLocal ? '' : '/sheikah-plate';
      const questImage = computed(() => {
        switch (props.questId) {
          case 'quest-2':
            return `${basePath}/assets/ui-assets/to-see-kass-off.png`;
          case 'quest-1':
          default:
            return `${basePath}/assets/ui-assets/add-new-recipe.png`;
        }
      });
      let autoCloseTimer = null;
  
      const close = () => {
        emit('close');
      };
  
      // Watch for when the component becomes visible and start the auto-close timer
      const startAutoCloseTimer = () => {
        if (autoCloseTimer) {
          clearTimeout(autoCloseTimer);
        }
        autoCloseTimer = setTimeout(() => {
          close();
        }, 8000); // 8 seconds
      };
  
      // Watch for changes to the visible prop
      watch(() => props.visible, (newVisible) => {
        if (newVisible) {
          startAutoCloseTimer();
        } else {
          // Clear timer if component becomes hidden
          if (autoCloseTimer) {
            clearTimeout(autoCloseTimer);
            autoCloseTimer = null;
          }
        }
      });
  
      return {
        close,
        startAutoCloseTimer,
        questImage,
        basePath
      };
    }
  }
  </script>
  
  <style scoped>
  .quest-completion-enter-active,
  .quest-completion-leave-active {
    transition: all 0.5s ease;
  }
  
  .quest-completion-enter-from {
    opacity: 0;
    transform: scale(0.9);
  }
  
  .quest-completion-leave-to {
    opacity: 0;
    transform: scale(1.1);
  }
  
  .quest-completion-enter-to,
  .quest-completion-leave-from {
    opacity: 1;
    transform: scale(1);
  }
  
  /* Grow-in animation for the complete badge */
  .complete-badge {
    animation: growIn 1.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  }
  
  @keyframes growIn {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.2);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  </style> 