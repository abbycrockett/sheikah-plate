<template>
  <div class="w-full h-screen flex flex-col items-center justify-center">
    <!-- Back Button -->
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
    
    <!-- Content -->
    <AddRecipe />
  </div>
</template>

<script>
import AddRecipe from '../components/AddRecipe.vue';

export default {
  name: 'RecipeMaintenance',
  components: {
    AddRecipe
  },
  emits: ['back-to-home']
}
</script> 