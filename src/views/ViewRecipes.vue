<template>
  <div class="w-full h-screen flex flex-col items-center justify-center relative">
     <div class="view-border-overlay"></div>
    
    <!-- Back Button (temp)-->
    <div class="absolute top-6 left-6 z-10">
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

    <!-- Carousel Container -->
    <div class="relative w-full max-w-6xl overflow-hidden" style="height: 550px;">
      <div 
        class="absolute inset-0 flex items-center justify-center gap-12 transition-transform duration-500 ease-out"
        :style="{ transform: `translateX(${translateX}px)` }"
      >
        <RecipeCard 
          v-for="(recipe, index) in recipes" 
          :key="recipe.id"
          :recipe="recipe"
          :isActive="index === activeIndex"
          :index="index"
          @click="handleRecipeCardClick(index)"
        />
      </div>
    </div>

    <!-- "View Recipe" Help -->
    <div v-if="recipes.length > 0" class="relative flex items-center justify-center mt-4">
      <div 
        class="flex items-center"
        @mouseover="showTooltip = true"
        @mouseleave="showTooltip = false"
      >
        <span class="text-white text-lg font-semibold mr-2">View recipe</span>
        <img src="/assets/ui-assets/y-button.png" alt="Y button" class="w-7 h-7">
      </div>

      <!-- Tooltip -->
      <transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showTooltip" class="absolute bottom-full mb-2 px-4 py-2 bg-black text-white text-sm rounded-xl shadow-lg whitespace-nowrap">
          Press Y
        </div>
      </transition>
    </div>

    <FullRecipeCard v-if="showFullRecipe" :recipe="recipes[activeIndex]" :closing="fullRecipeClosing" @close="handleFullRecipeClose" />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import RecipeCard from '../components/RecipeCard.vue'
import FullRecipeCard from '../components/FullRecipeCard.vue'
import { Recipe } from '../models/Recipe.js'
import { loadRecipes } from '../scripts/recipesStorage.js'

export default {
  name: 'ViewRecipes',
  components: {
    RecipeCard,
    FullRecipeCard
  },
  emits: ['back-to-home'],
  setup() {
    const recipes = ref([])
    const activeIndex = ref(0) // Start with the first recipe
    const translateX = ref(0)
    const showTooltip = ref(false)
    const showFullRecipe = ref(false)
    const fullRecipeClosing = ref(false)
    const canOpenModal = ref(true)
    let canOpenModalTimeout = null
    
    function refreshRecipes() {
      recipes.value = loadRecipes()
    }
    refreshRecipes()
    
    // Listen for recipe-added event
    if (typeof window !== 'undefined') {
      window.addEventListener('recipe-added', refreshRecipes)
    }
    
    const setActiveCard = (index) => {
      activeIndex.value = index
      // Calculate translation to center the active card
      const cardWidth = 260 // Base width of the SVG card
      const gap = 48 // Gap between cards (12 * 4px from gap-12)
      const offset = (index - 2) * (cardWidth + gap) // 2 is the 'natural' center index for a 5-card layout
      translateX.value = -offset
    }
    
    function handleFullRecipeClose() {
      showFullRecipe.value = false;
      fullRecipeClosing.value = false;
    }
    
    const handleKeydown = (event) => {
      if (showFullRecipe.value && !fullRecipeClosing.value) {
        // Trigger closing animation
        fullRecipeClosing.value = true
        return
      }
      if (event.key === 'ArrowLeft' || event.key === 'a') {
        if (activeIndex.value > 0) {
          setActiveCard(activeIndex.value - 1)
        }
      } else if (event.key === 'ArrowRight' || event.key === 'd') {
        if (activeIndex.value < recipes.value.length - 1) {
          setActiveCard(activeIndex.value + 1)
        }
      } else if (event.key === 'y' || event.key === 'Y' || event.key === 's') {
        // Open the full recipe modal
        showFullRecipe.value = true
      }
    }
    
    // New handler for RecipeCard click
    function handleRecipeCardClick(index) {
      if (index === activeIndex.value && canOpenModal.value) {
        showFullRecipe.value = true;
      } else {
        setActiveCard(index);
        canOpenModal.value = false;
        if (canOpenModalTimeout) clearTimeout(canOpenModalTimeout);
        canOpenModalTimeout = setTimeout(() => {
          canOpenModal.value = true;
        }, 200);
      }
    }
    
    onMounted(() => {
      window.addEventListener('keydown', handleKeydown)
      // Center the initial active card
      setActiveCard(activeIndex.value)
    })
    
    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeydown)
      if (canOpenModalTimeout) clearTimeout(canOpenModalTimeout);
      if (typeof window !== 'undefined') {
        window.removeEventListener('recipe-added', refreshRecipes);
      }
    })
    
    return {
      recipes,
      activeIndex,
      translateX,
      setActiveCard,
      showTooltip,
      showFullRecipe,
      fullRecipeClosing,
      handleFullRecipeClose,
      handleRecipeCardClick
    }
  }
}
</script>

<style scoped>
.view-border-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; 
  border: 3px solid rgba(95, 222, 255, 0.5);
  box-shadow: 0 0 20px rgba(95, 222, 255, 0.5), inset 0 0 12px #103f4b;
  z-index: 20; 
  border-radius: 18px;
  animation: border-glow 2.5s ease-in-out infinite;
}

@keyframes border-glow {
  0% {
    border-color: rgba(95, 222, 255, 0.4);
    box-shadow: 0 0 24px 6px rgba(95, 222, 255, 0.8), inset 0 0 18px #103f4b;
  }
  40% {
    border-color: #1a284f;
    box-shadow: 0 0 12px 2px #1a284f, inset 0 0 24px #255b9e;
  }
  60% {
    border-color: #1a284f;
    box-shadow: 0 0 12px 2px #1a284f, inset 0 0 24px #255b9e;
  }
  100% {
    border-color: rgba(95, 222, 255, 0.5);
    box-shadow: 0 0 24px 6px rgba(95, 222, 255, 0.5), inset 0 0 18px #103f4b;
  }
}
</style> 
