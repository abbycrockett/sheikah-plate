<template>
  <div 
    class="recipe-card cursor-pointer transition-all duration-500 ease-out"
    :class="cardClasses"
    @click="$emit('click')"
  >
    <div class="relative h-full">
      <img 
        src="/assets/ui-assets/single-recipe-box.svg" 
        :alt="recipe.name"
        class="w-full h-full object-fill"
      />
      <!-- Content Container -->
      <div class="absolute inset-0 flex flex-col items-center pointer-events-none">
        <!-- Title -->
        <div 
          class="text-center max-w-[80%] transition-all duration-500 ease-out"
          :class="isActive ? 'pt-16' : 'pt-12'"
        >
          <h3 
            class="font-bold text-2xl" 
            style="font-family: var(--main-font); color: #453906;"
          >
            {{ recipe.name }}
          </h3>
        </div>
        
        <!-- Recipe Picture -->
        <div v-if="recipe.picture" class="mt-6 flex items-center justify-center w-full px-8">
          <img 
            :src="pictureUrl" 
            :alt="`Image of ${recipe.name}`" 
            class="max-w-full object-contain drop-shadow-lg transition-all duration-500 ease-out"
            :class="isActive ? 'max-h-[140px]' : 'max-h-[100px]'"
          />
        </div>
        
        <!-- Description -->
        <div v-if="recipe.description" class="mt-4 text-left max-w-[85%] px-4">
          <p 
            class="text-sm leading-tight transform transition-all duration-500 ease-out"
            style="font-family: var(--main-font); color: #655A36;"
            :class="isActive 
              ? 'scale-100 opacity-100 translate-y-0' 
              : 'scale-75 opacity-75 -translate-y-5'"
          >
            {{ recipe.description }}
          </p>
        </div>

        <!-- Hearts Container -->
        <div
          class="absolute w-full px-12 pb-5 transition-all duration-500 ease-out"
          :class="isActive ? 'bottom-14' : 'bottom-10'"
        >
          <div class="h-px bg-transparent w-full mb-2"></div>
          <div class="flex justify-center items-center space-x-1">
            <img
              v-for="n in 5"
              :key="n"
              :src="getHeartSrc(n)"
              alt="heart"
              class="transition-all duration-500 ease-out"
              :class="isActive ? 'w-6 h-6' : 'w-4 h-4'"
            />
          </div>
          <div class="h-px bg-transparent w-full mt-2"></div>
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
    },
    pictureUrl() {
      if (!this.recipe.picture) return '';
      if (typeof this.recipe.picture === 'string') return this.recipe.picture;
      return URL.createObjectURL(this.recipe.picture);
    }
  },
  methods: {
    getAssetPath(path) {
      // Check if we're on GitHub Pages by looking at the hostname
      if (window.location.hostname.includes('github.io')) {
        return `/sheikah-plate${path}`;
      }
      // Local development and preview
      return path;
    },
    getHeartSrc(n) {
      const hearts = this.recipe.hearts;
      if (hearts >= n) {
        return './assets/ui-assets/full-heart.png';
      }
      if (hearts >= n - 0.5) {
        return './assets/ui-assets/half-heart.png';
      }
      return './assets/ui-assets/empty-heart.png';
    }
  }
}
</script>

<style scoped>
.recipe-card {
  min-width: 260px;
  max-width: 260px;
  height: 420px;
}

/* Make active card larger */
.recipe-card.scale-125 {
  min-width: 325px; /* 260 * 1.25 */
  max-width: 325px;
  height: 525px; /* 420 * 1.25 */
}
</style> 