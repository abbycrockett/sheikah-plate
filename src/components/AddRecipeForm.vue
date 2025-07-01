<template>
  <div class="relative w-full h-screen overflow-hidden" tabindex="0" @keydown="handleKeydown">
    <!-- Back Button -->
    <div class="absolute top-6 left-6 z-20">
      <button 
        @click="$emit('back-to-home')"
        class="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl px-4 py-2 transition-all duration-300 group"
      >
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        <span class="text-white font-semibold">Back to Home</span>
      </button>
    </div>
    <!-- Backgrounds -->
    <transition name="fade-bg">
      <img
        v-if="currentStep === 1"
        key="kakariko"
        src="/assets/ui-assets/kakariko-bg.png"
        alt="Kakariko Background"
        class="absolute left-0 top-0 h-full object-left object-cover select-none pointer-events-none"
        draggable="false"
      />
      <img
        v-else
        key="linkhappy"
        src="/assets/ui-assets/link-happy-bg.png"
        alt="Link Happy Background"
        class="absolute left-0 top-0 h-full object-left object-cover select-none pointer-events-none"
        draggable="false"
      />
    </transition>
    <img
      src="/assets/ui-assets/add-bg.svg"
      alt="Add Background"
      class="absolute top-1/2 left-[20%] transform -translate-y-1/2 select-none pointer-events-none"
      draggable="false"
      style="z-index: 1; max-height: 100vh; width: 110%;"
    />
    <!-- Form Content -->
    <div class="relative z-10 flex flex-col items-end justify-start h-full w-full mt-12 pr-24">
      <form class="max-w-lg w-full flex flex-col gap-6" @submit.prevent>
        <!-- Step 1: Pg1 fields -->
        <div v-show="currentStep === 1" class="flex flex-col gap-6">
          <!-- Recipe Name -->
          <div>
            <label for="recipe-name" class="recipe-label select-none" draggable="false">Recipe Name</label>
            <input
              id="recipe-name"
              v-model="recipeName"
              type="text"
              placeholder="e.g., Carrot Cake"
              class="recipe-input"
            />
          </div>
          <!-- Category -->
          <div>
            <label class="recipe-label select-none" draggable="false">Category</label>
            <div class="flex gap-3">
              <button
                v-for="cat in categories"
                :key="cat"
                type="button"
                @click="recipeCategory = cat"
                :class="[
                  'category-button',
                  recipeCategory === cat ? 'category-button-active' : 'category-button-inactive'
                ]"
              >
                {{ cat }}
              </button>
            </div>
          </div>
          <!-- Image Upload -->
          <div>
            <label class="recipe-label select-none" draggable="false">Recipe Image</label>
            <div class="flex flex-col items-start gap-2">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="onFileChange"
                class="hidden"
              />
              <div
                class="upload-box"
                @click="triggerFileInput"
              >
                <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="upload-preview" />
                <div v-else class="upload-placeholder">
                  <img src="/assets/ui-assets/camera-rune.svg" alt="Camera" class="camera-icon select-none" draggable="false" />
                  <span class="upload-text select-none" draggable="false">Click to upload</span>
                  <span class="upload-subtext select-none" draggable="false">PNG, JPG, GIF up to 10MB</span>
                </div>
              </div>
              <button v-if="imagePreview" type="button" class="remove-image-button" @click="removeImage">Remove Image</button>
            </div>
          </div>
        </div>
        <!-- Step 2: Pg2 fields -->
        <div v-show="currentStep === 2">
          <!-- Description -->
          <div>
            <label for="description" class="recipe-label select-none" draggable="false">Description</label>
            <textarea id="description" class="recipe-textarea" rows="2" placeholder="Even those who don't like carrots tend to enjoy the mild sweetness of this cake."
              v-model="description"
            ></textarea>
          </div>
          <!-- Rating -->
          <div>
            <label class="recipe-label select-none" draggable="false">Rating</label>
            <div class="hearts-container">
              <img
                v-for="n in 5"
                :key="n"
                :src="getHeartSrc(n)"
                @click="setRating(n, $event)"
                class="heart compact-heart select-none"
                alt="heart"
                draggable="false"
              />
            </div>
          </div>
          <!-- Ingredients -->
          <div>
            <label for="ingredients" class="recipe-label select-none" draggable="false">Ingredients (one per line)</label>
            <textarea id="ingredients" class="recipe-textarea" rows="3" placeholder="Endura Carrots
Goat Butter
Cane Sugar"
              v-model="ingredients"
            ></textarea>
          </div>
          <!-- Directions -->
          <div>
            <label for="directions" class="recipe-label select-none" draggable="false">Directions</label>
            <textarea id="directions" class="recipe-textarea" rows="5" placeholder="Mix carrots, butter, flour, and sugar together.
Pour into a pan and bake until golden brown."
              v-model="directions"
            ></textarea>
          </div>
        </div>
        <!-- Navigation Buttons -->
        <div class="flex justify-between w-full">
          <button v-if="currentStep === 2" type="button" @click="currentStep = 1"
            class="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl px-4 py-2 transition-all duration-300 group">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span class="text-white font-semibold">Previous Page</span>
          </button>
          <div class="flex-1"></div>
          <button v-if="currentStep === 1" type="button" @click="currentStep = 2"
            class="flex items-center space-x-2 bg-[#3E2A1A]/80 hover:bg-[#3E2A1A] border border-[#3E2A1A] hover:border-[#5C3B1E] rounded-xl px-4 py-2 transition-all duration-300 group">
            <span class="text-white font-semibold">Next Page</span>
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          <button v-if="currentStep === 2" type="button" @click="handleSave"
            class="flex items-center space-x-2 bg-[#3E2A1A] hover:bg-[#EC6934] text-white font-bold rounded-xl px-8 py-3 shadow-lg transition-all duration-300 border-2 border-transparent hover:border-[#75430D]">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21C12 21 4 13.684 4 8.857C4 5.613 6.686 3 9.857 3C11.429 3 12.857 3.857 13.714 5.143C14.571 3.857 16 3 17.571 3C20.743 3 23.429 5.613 23.429 8.857C23.429 13.684 16 21 16 21H12Z"/>
            </svg>
            <span>Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useHeartRating } from '../scripts/useHeartRating.js';
import { saveRecipe as saveRecipeToStorage } from '../scripts/recipesStorage.js';

export default {
  name: 'AddRecipeForm',
  emits: ['back-to-home', 'save'],
  setup(props, { emit }) {
    const currentStep = ref(1);
    const recipeName = ref('');
    const recipeCategory = ref('');
    const imageFile = ref(null);
    const imagePreview = ref('');
    const description = ref('');
    const ingredients = ref('');
    const directions = ref('');
    const { hearts, getHeartSrc, setRating } = useHeartRating(0);

    const isFormValid = computed(() => {
      return recipeName.value.trim() &&
        recipeCategory.value &&
        description.value.trim() &&
        ingredients.value.trim() &&
        directions.value.trim();
    });

    function triggerFileInput() {
      document.querySelector('input[type=file]').click();
    }
    function onFileChange(e) {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        imageFile.value = file;
        imagePreview.value = URL.createObjectURL(file);
      }
    }
    function removeImage() {
      imageFile.value = null;
      imagePreview.value = '';
      document.querySelector('input[type=file]').value = '';
    }
    async function handleSave() {
      if (!isFormValid.value) return;
      const recipeToSave = {
        name: recipeName.value,
        category: recipeCategory.value,
        description: description.value,
        directions: directions.value,
        hearts: hearts.value,
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        picture: imageFile.value,
        ingredients: ingredients.value.split('\n').map(i => i.trim()).filter(Boolean),
      };
      try {
        await saveRecipeToStorage(recipeToSave);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('recipe-added'));
        }
        emit('save', recipeToSave);
        emit('back-to-home');
      } catch (e) {
        alert('Failed to save recipe. Please try again.');
        console.error(e);
      }
    }
    function handleKeydown(e) {
      // If the event target is an input, textarea, or contenteditable element, 
      // don't handle navigation keys to allow normal typing
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true') {
        // Prevent the event from bubbling up to parent components
        e.stopPropagation();
        return;
      }
      
      if (e.key === 'ArrowLeft') {
        if (currentStep.value > 1) {
          currentStep.value--;
        }
      } else if (e.key === 'ArrowRight') {
        if (currentStep.value < 2) {
          currentStep.value++;
        }
      }
    }

    onMounted(() => {
      // Auto-focus the container to enable keyboard navigation immediately
      const container = document.querySelector('.relative.w-full.h-screen.overflow-hidden');
      if (container) {
        container.focus();
      }
    });

    return {
      currentStep,
      recipeName,
      recipeCategory,
      imageFile,
      imagePreview,
      description,
      ingredients,
      directions,
      hearts,
      getHeartSrc,
      setRating,
      triggerFileInput,
      onFileChange,
      removeImage,
      handleSave,
      isFormValid,
      categories: ['Breakfast', 'Entrée', 'Dessert'],
      handleKeydown,
    };
  },
};
</script>

<style scoped>
/* Pg1 and Pg2 styles combined, unchanged from originals */
.recipe-label {
  display: block;
  font-size: 22px;
  font-weight: 620;
  margin-bottom: 8px;
  color: #3E2A1A; 
}

.recipe-input {
  width: 65%;
  padding: 0.5rem 0.75rem;
  border: 2px solid #3E2A1A;
  border-radius: 0.75rem;
  background-color: #FAF6E9;
  color: #3E2A1A;
  font-size: 16px;
  transition: all 0.2s ease-in-out;
}

.recipe-input:focus {
  outline: none;
  border-color: #A1712E;
  background-color: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(161, 113, 46, 0.1);
  transform: translateY(-1px);
}

.recipe-input::placeholder {
  color: #8B7355;
  opacity: 0.7;
}

.upload-box {
  width: 160px;
  height: 160px;
  border: 2px solid #3E2A1A;
  border-radius: 0.75rem;
  background-color: #FAF6E9;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-box:hover {
  border-color: #A1712E;
  background-color: #FFFFFF;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(62, 42, 26, 0.1);
}

.upload-box:hover .camera-icon {
  content: url('/assets/ui-assets/camera-rune-hover.svg');
}

.upload-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
}

.upload-text {
  font-size: 16px;
  font-weight: 600;
  color: #3E2A1A;
  margin-bottom: 2px;
  margin-top: -8px;
}

.upload-subtext {
  font-size: 14px;
  color: #8B7355;
  opacity: 0.8;
}

.camera-icon {
  width: 72px;
  height: 72px;
  margin-bottom: 1px;
}

.category-button {
  padding: 0.5rem 0.75rem;
  border: 2px solid #3E2A1A; 
  border-radius: 0.75rem;
  font-weight: 600;
  color: #3E2A1A;
  transition: all 0.2s ease-in-out;
}

.category-button:hover {
  background-color: #a27e4a; 
  color: #FFFFFF;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(62, 42, 26, 0.2);
}

.category-button-active {
  background-color: #A1712E;; 
  color: #FAF6E9; 
  border-color: #443505;
}

.category-button-inactive {
  color: #3E2A1A; 
}

.remove-image-button {
  padding: 0.2rem 0.4rem;
  border: 1px solid #3E2A1A;
  border-radius: 0.75rem;
  font-weight: 600;
  color: #5C3B1E; 
  background-color: #E7C88C; 
  transition: all 0.2s ease-in-out;
  margin-top: 8px;
}

.remove-image-button:hover {
  background-color: #C09E62; 
  color: #3E2A1A;
  transform: translateY(-1px);
}

.recipe-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 2px solid #3E2A1A;
  background-color: #FAF6E9;
  color: #3E2A1A;
  font-size: 15px;
  transition: all 0.2s ease-in-out;
  font-family: var(--main-font);
}

.recipe-textarea:focus {
  outline: none;
  border-color: #A1712E;
  background-color: #FFFFFF;
  box-shadow: 0 0 0 2px rgba(161, 113, 46, 0.08);
  transform: translateY(-1px);
}

.recipe-textarea::placeholder {
  color: #8B7355;
  opacity: 0.7;
}

.hearts-container {
  display: flex;
  gap: 0.25rem;
  justify-content: flex-start;
}

.heart {
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.compact-heart {
  width: 28px;
  height: 28px;
}

.heart:hover {
  transform: scale(1.08);
}

/* Fade transition for background images */
.fade-bg-enter-active, .fade-bg-leave-active {
  transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-bg-enter-from, .fade-bg-leave-to {
  opacity: 0;
}
.fade-bg-enter-to, .fade-bg-leave-from {
  opacity: 1;
}
</style> 