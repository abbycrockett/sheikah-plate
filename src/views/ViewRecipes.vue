<template>
  <div class="w-full h-screen flex flex-col items-center justify-center relative">
    <!-- <div class="view-border-overlay"></div> -->
    
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
          @click="setActiveCard(index)"
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
    
    recipes.value = [
      new Recipe(
        'Mushroom Skewer', 
        '/assets/recipe-assets/Mushroom_Skewer.png',
        'A simple dish made by cooking mushrooms on a stick. The mushrooms are grilled to perfection, bringing out their natural umami flavor.',
        1,
        'Clean mushrooms thoroughly. Carefully thread them onto a skewer. Grill over an open flame until tender and slightly browned.',
        ['1x Hylian Shroom', '1x Skewer Stick']
      ),
      new Recipe(
        'Seafood Skewer', 
        '/assets/recipe-assets/Seafood_Skewer.png',
        'Fresh seafood grilled on a skewer. The combination of different sea creatures creates a rich, oceanic taste that\'s both savory and satisfying.',
        3.5,
        'Marinate assorted seafood in herbs and oil. Skewer alternately. Grill on high heat for 2-3 minutes per side until cooked through.',
        ['1x Mighty Porgy', '1x Hyrule Bass']
      ),
      new Recipe(
        'Meat Skewer', 
        '/assets/recipe-assets/Meat_Skewer.png',
        'Juicy meat grilled to perfection on a stick. The high heat seals in the natural juices, creating a tender and flavorful dish that\'s perfect for restoring stamina.',
        2,
        'Cut quality meat into bite-sized cubes. Season generously with salt and spices. Skewer and grill over a hot fire, turning occasionally.',
        ['1x Raw Meat', '1x Goron Spice']
      ),
      new Recipe(
        'Fruitcake', 
        '/assets/recipe-assets/Fruitcake.png',
        'A sweet and moist cake filled with fresh fruits. The natural sweetness of the fruits combined with the soft cake texture.',
        4,
        'Combine flour, sugar, and eggs in a bowl. Fold in a mix of fresh, wild berries. Bake at 375°F for 25 minutes until golden.',
        ['1x Wildberry', '1x Apple', '1x Cane Sugar', '1x Goat Butter']
      ),
      new Recipe(
        'Honey Candy', 
        '/assets/recipe-assets/Honey_Candy.png',
        'A sweet confection made from pure honey. This golden treat is not only delicious but also has healing properties.',
        5,
        'Gently heat Courser Bee Honey in a pot until it begins to thicken. Pour onto a greased surface and let it cool completely. Break into pieces.',
        ['1x Courser Bee Honey']
      )
    ]
    
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
      if (event.key === 'ArrowLeft') {
        if (activeIndex.value > 0) {
          setActiveCard(activeIndex.value - 1)
        }
      } else if (event.key === 'ArrowRight') {
        if (activeIndex.value < recipes.value.length - 1) {
          setActiveCard(activeIndex.value + 1)
        }
      } else if (event.key === 'y' || event.key === 'Y') {
        // Open the full recipe modal
        showFullRecipe.value = true
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
      setActiveCard,
      showTooltip,
      showFullRecipe,
      fullRecipeClosing,
      handleFullRecipeClose
    }
  }
}
</script>

<style scoped>
/* Maybe later?
.view-border-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; 
  border: 3px solid #5fdeff;
  box-shadow: 0 0 20px #5fdeff, inset 0 2 12px #103f4b;
  z-index: 20; 
}
*/
</style> 
