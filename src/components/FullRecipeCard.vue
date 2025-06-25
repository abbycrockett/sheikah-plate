<template>
  <transition name="fade-bg">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <transition name="fade">
        <div v-if="visible" class="absolute inset-0 bg-black bg-opacity-60"></div>
      </transition>
      <transition name="pop-fade">
        <div 
          v-if="cardVisible" 
          class="relative flex items-center justify-center pop-card z-10"
          @click="showOptions"
        >
          <img 
            src="/assets/ui-assets/full-recipe-box.svg" 
            alt="Full Recipe Box" 
            class="max-w-full max-h-[89.9vh]"
          />
          <!-- Recipe content will go here -->
          <div class="absolute inset-0 flex items-start justify-start pt-16 pl-32">
            <!-- Left-aligned content block -->
            <div class="flex flex-col items-center">
              <!-- Recipe Image -->
              <div class="w-44 h-44 border-4 rounded-md transform -translate-x-14" style="border-color: #554502; background-color: rgba(0,0,0,0.2);">
                <img 
                  v-if="recipe.picture"
                  :src="recipe.picture" 
                  :alt="recipe.name" 
                  class="w-full h-full object-cover"
                />
              </div>
              
              <!-- Recipe Nameplate -->
              <div class="relative mt-4 flex items-center justify-center px-6 py-2 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 rounded-md shadow-md transform -translate-x-14 w-70">
                  <span class="text-white text-2xl font-bold tracking-wider" style="font-family: var(--main-font);">{{ recipe.name }}</span>
              </div>

              <!-- Directions -->
              <div v-if="recipe.directions" class="mt-6 text-left max-w-xs transform -translate-x-14">
                <p class="text-lg leading-snug" style="color: #453906;">
                  {{ recipe.directions }}
                </p>
              </div>
            </div>

            <!-- Ingredients -->
            <div v-if="recipe.ingredients && recipe.ingredients.length" class="absolute left-1/2 top-16 -ml-8">
              <h3 class="text-3xl font-bold mb-4" style="color: #453906;">Ingredients</h3>
              <ul>
                <li v-for="(ingredient, idx) in recipe.ingredients" :key="ingredient"
                    :class="[ 'text-lg cursor-pointer select-none', { 'line-through text-gray-400': crossed[idx] } ]"
                    style="color: #453906;"
                    @click.stop="toggleCross(idx)">
                  {{ ingredient }}
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Options overlay -->
          <transition name="fade">
            <div v-if="optionsVisible" 
                 class="absolute"
                 :style="{ left: clickX + 'px', top: clickY + 'px', transform: 'translate(-50%, -50%)' }">
              <div class="relative w-32 h-24">
                <div class="absolute top-0 w-32 h-8 edit-option"></div>
                <div class="absolute top-8 w-32 h-8 delete-option"></div>
                <div class="absolute top-16 w-32 h-8 exit-option" @click="closeCard"></div>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { ref, watch, onBeforeUnmount } from 'vue';
export default {
  name: 'FullRecipeCard',
  props: {
    recipe: {
      type: Object,
      required: true
    },
    closing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      cardVisible: false,
      closeTimeout: null,
      crossed: [],
      optionsVisible: false,
      clickX: 0,
      clickY: 0
    }
  },
  mounted() {
    // Fade in background, then pop in card
    requestAnimationFrame(() => {
      this.visible = true
      setTimeout(() => {
        this.cardVisible = true
      }, 120) // Delay for bg fade
    })
  },
  watch: {
    recipe: {
      immediate: true,
      handler(newRecipe) {
        // Reset crossed state when recipe changes
        this.crossed = newRecipe && newRecipe.ingredients ? newRecipe.ingredients.map(() => false) : [];
      }
    },
    closing(val) {
      if (val) {
        this.cardVisible = false;
        // Reset crossed state on close
        this.crossed = this.recipe && this.recipe.ingredients ? this.recipe.ingredients.map(() => false) : [];
      }
    },
    cardVisible(val) {
      if (!val && this.closing) {
        clearTimeout(this.closeTimeout)
        this.closeTimeout = setTimeout(() => {
          this.$emit('close')
        }, 120)
      }
    }
  },
  methods: {
    toggleCross(idx) {
      this.crossed[idx] = !this.crossed[idx];
    },
    showOptions(event) {
      this.optionsVisible = !this.optionsVisible;
      const rect = event.currentTarget.getBoundingClientRect();
      this.clickX = event.clientX - rect.left;
      this.clickY = event.clientY - rect.top;
    },
    closeCard() {
      this.cardVisible = false;
      this.$emit('close');
    }
  },
  beforeUnmount() {
    clearTimeout(this.closeTimeout)
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

.line-through {
  text-decoration: line-through;
}

.edit-option {
  background-image: url('/assets/ui-assets/edit.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}

.edit-option:hover {
  background-image: url('/assets/ui-assets/edit-hover.png') !important;
}

.delete-option {
  background-image: url('/assets/ui-assets/delete.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}

.delete-option:hover {
  background-image: url('/assets/ui-assets/delete-hover.png') !important;
}

.exit-option {
  background-image: url('/assets/ui-assets/exit.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}

.exit-option:hover {
  background-image: url('/assets/ui-assets/exit-hover.png') !important;
}
</style> 