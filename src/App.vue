<template>
  <div class="w-full h-screen flex items-center justify-center overflow-hidden">
    <div class="relative w-full max-w-6xl">
      <!-- Recipe Cards Container -->
      <div 
        class="flex items-center justify-center gap-16 transition-transform duration-500 ease-out"
        :style="{ transform: `translateX(${translateX}px)` }"
      >
        <RecipeCard 
          v-for="(recipe, index) in recipes" 
          :key="recipe.id"
          :recipe="recipe"
          :isActive="index === activeIndex"
          :index="index"
          @click="setActiveCard(index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import RecipeCard from './components/RecipeCard.vue'
import { Recipe } from './models/Recipe.js'

export default {
  name: 'App',
  components: {
    RecipeCard
  },
  setup() {
    const recipes = ref([
      new Recipe('Mushroom Skewer'),
      new Recipe('Seafood Skewer'),
      new Recipe('Meat Skewer'),
      new Recipe('Fruitcake'),
      new Recipe('Honey Candy')
    ])
    
    const activeIndex = ref(2) // Start with middle card
    const translateX = ref(0)
    
    const setActiveCard = (index) => {
      activeIndex.value = index
      // Calculate translation to center the active card
      const cardWidth = 324 // Base width of the SVG card
      const gap = 64 // Gap between cards (16 * 4px from gap-16)
      const offset = (index - 2) * (cardWidth + gap) // 2 is the center index
      translateX.value = -offset
    }
    
    const handleKeydown = (event) => {
      if (event.key === 'ArrowLeft') {
        if (activeIndex.value > 0) {
          setActiveCard(activeIndex.value - 1)
        }
      } else if (event.key === 'ArrowRight') {
        if (activeIndex.value < recipes.value.length - 1) {
          setActiveCard(activeIndex.value + 1)
        }
      }
    }
    
    onMounted(() => {
      window.addEventListener('keydown', handleKeydown)
      // Center the initial active card
      setActiveCard(activeIndex.value)
    })
    
    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeydown)
    })
    
    return {
      recipes,
      activeIndex,
      translateX,
      setActiveCard
    }
  }
}
</script> 