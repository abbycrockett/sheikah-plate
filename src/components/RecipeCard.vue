<template>
  <div 
    class="recipe-card cursor-pointer transition-all duration-500 ease-out"
    :class="cardClasses"
    @click="$emit('click')"
  >
    <div class="relative">
      <img 
        src="/assets/ui-assets/single-recipe-box.svg" 
        :alt="recipe.name"
        class="w-full h-auto"
      />
      <!-- Recipe Title Overlay -->
      <div class="absolute inset-x-0 top-0 pt-8 flex items-start justify-center pointer-events-none">
        <div class="max-w-[80%] text-center">
          <h3 
            class="font-bold text-2xl" 
            style="font-family: Arial, sans-serif; color: #453906;"
          >
            {{ recipe.name }}
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipeCard',
  props: {
    recipe: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      required: true
    }
  },
  computed: {
    cardClasses() {
      const baseClasses = 'transform'
      
      if (this.isActive) {
        return `${baseClasses} scale-125 opacity-100 z-10`
      } else {
        // Calculate distance from center for scaling and opacity
        const distance = Math.abs(this.index - 2) // 2 is center index
        const scale = Math.max(0.5, 1 - distance * 0.05)
        const opacity = Math.max(0.2, 1 - distance * 0.4)
        return `${baseClasses} scale-${Math.round(scale * 100)} opacity-${Math.round(opacity * 100)} z-0`
      }
    }
  }
}
</script>

<style scoped>
.recipe-card {
  min-width: 324px;
  max-width: 324px;
}

/* Make active card larger */
.recipe-card.scale-125 {
  min-width: 405px; /* 324 * 1.25 */
  max-width: 405px;
}
</style> 