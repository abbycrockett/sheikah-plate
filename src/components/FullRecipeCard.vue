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
          <div class="absolute inset-0 pt-16 pl-40">
            <!-- Left-aligned content block -->
            <div class="relative w-44">
              <!-- Recipe Image -->
              <div class="w-44 h-44 border-4 rounded-md" style="border-color: #554502; background-color: rgba(0,0,0,0.2);">
                <img 
                  v-if="recipe.picture"
                  :src="pictureUrl"
                  :alt="recipe.name" 
                  class="w-full h-full object-cover"
                />
              </div>
              
              <!-- Recipe Nameplate -->
              <div class="absolute top-48 left-1/2 transform -translate-x-1/2 flex items-center justify-center px-6 py-2 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 rounded-md shadow-md w-max">
                  <span class="text-white text-2xl font-bold tracking-wider" style="font-family: var(--main-font);">{{ recipe.name }}</span>
              </div>

              <!-- Ingredients Block -->
              <div
                v-if="recipe.ingredients && recipe.ingredients.length"
                :class="[
                  'absolute top-64 -left-10 text-left max-w-lg w-95 pr-1',
                  ingredientsScrollable ? 'max-h-44 overflow-y-auto ingredients-scrollbar min-w-[16rem]' : ''
                ]"
                style=""
              >
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

            <!-- Directions Block -->
            <div v-if="recipe.directions" class="absolute left-1/2 top-16 -ml-8 max-w-md w-96">
              <h3 class="text-3xl font-bold mb-4" style="color: #453906;">Directions</h3>
              <p class="text-lg leading-snug" style="color: #453906;">
                {{ recipe.directions }}
              </p>
            </div>
          </div>
          
          <!-- Options overlay -->
          <transition name="fade">
            <div v-if="optionsVisible" 
                 class="absolute"
                 :style="{ left: clickX + 'px', top: clickY + 'px', transform: 'translate(-50%, -50%)' }">
              <div class="relative w-32 h-24">
                <div class="absolute top-0 w-32 h-8 option-edit" @click.stop="$emit('edit', recipe)"></div>
                <div class="absolute top-8 w-32 h-8 option-delete" @click="showDeleteModal"></div>
                <div class="absolute top-16 w-32 h-8 option-exit" @click="closeCard"></div>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </div>
  </transition>
  
  <!-- Delete Confirmation Modal -->
  <DeleteConfirmationModal
    :visible="deleteModalVisible"
    :recipe-name="recipe.name"
    @confirm="handleDeleteConfirm"
    @cancel="handleDeleteCancel"
    @close="deleteModalVisible = false"
  />
</template>

<script>
import { ref, watch, onBeforeUnmount } from 'vue';
import DeleteConfirmationModal from './DeleteConfirmationModal.vue';

export default {
  name: 'FullRecipeCard',
  components: {
    DeleteConfirmationModal
  },
  emits: ['close', 'delete', 'edit'],
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
      clickY: 0,
      deleteModalVisible: false,
      objectUrl: null
    }
  },
  computed: {
    pictureUrl() {
      // Clean up previous object URL
      if (this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl)
        this.objectUrl = null
      }
      
      if (!this.recipe.picture) return '';
      
      // Handle string URLs (base64 data URLs or regular URLs)
      if (typeof this.recipe.picture === 'string') {
        return this.recipe.picture;
      }
      
      // Handle Blob objects
      if (this.recipe.picture instanceof Blob || this.recipe.picture instanceof File) {
        try {
          this.objectUrl = URL.createObjectURL(this.recipe.picture);
          return this.objectUrl;
        } catch (error) {
          console.warn('Error creating object URL for recipe:', this.recipe.name, error);
          return '';
        }
      }
      
      // Handle other object types that might have been serialized
      if (typeof this.recipe.picture === 'object' && this.recipe.picture !== null) {
        console.warn('Unexpected picture object type for recipe:', this.recipe.name, this.recipe.picture);
        return '';
      }
      
      // If it's not a valid type, return empty string
      console.warn('Invalid picture type for recipe:', this.recipe.name, typeof this.recipe.picture);
      return '';
    },
    ingredientsScrollable() {
      return this.recipe && this.recipe.ingredients && this.recipe.ingredients.length > 6;
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
      this.clickY = event.clientY - rect.top - 32;
    },
    closeCard() {
      this.cardVisible = false;
      this.$emit('close');
    },
    showDeleteModal() {
      this.deleteModalVisible = true;
    },
    handleDeleteConfirm() {
      this.$emit('delete', this.recipe);
      this.closeCard();
    },
    handleDeleteCancel() {
      // Modal will close itself, just hide options
      this.optionsVisible = false;
    }
  },
  beforeUnmount() {
    clearTimeout(this.closeTimeout)
    // Clean up object URL when component is destroyed
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl)
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

.line-through {
  text-decoration: line-through;
}

.option-edit {
  background-image: url('/assets/ui-assets/edit.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}

.option-edit:hover {
  background-image: url('/assets/ui-assets/edit-hover.png') !important;
}

.option-delete {
  background-image: url('/assets/ui-assets/delete.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}

.option-delete:hover {
  background-image: url('/assets/ui-assets/delete-hover.png') !important;
}

.option-exit {
  background-image: url('/assets/ui-assets/exit.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}

.option-exit:hover {
  background-image: url('/assets/ui-assets/exit-hover.png') !important;
}

/* Custom scrollbar for ingredients */
.ingredients-scrollbar::-webkit-scrollbar {
  width: 7px;
  background: transparent;
}
.ingredients-scrollbar::-webkit-scrollbar-thumb {
  background: transparent;
  transition: background 0.2s;
}
.ingredients-scrollbar:hover::-webkit-scrollbar-thumb,
.ingredients-scrollbar:active::-webkit-scrollbar-thumb {
  background: rgba(85, 69, 2, 0.25); /* muted brown, semi-transparent */
}
.ingredients-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
.ingredients-scrollbar:hover,
.ingredients-scrollbar:active {
  scrollbar-color: rgba(85,69,2,0.25) transparent;
}
</style> 