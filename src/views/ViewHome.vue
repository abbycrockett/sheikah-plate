<template>
  <div class="w-full h-screen flex flex-col items-center justify-center">
    <h1 class="text-5xl font-bold text-white mb-8">Sheikah Plate</h1>
    <div class="flex space-x-4">
      <button @click="$emit('show-recipes')" class="text-white text-2xl font-semibold bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-8 py-4 transition-all duration-300">
        View Recipes
      </button>
      <button @click="$emit('show-add-recipe')" class="text-white text-2xl font-semibold bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl px-8 py-4 transition-all duration-300">
        Add Recipe
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ViewHome',
  emits: ['show-recipes', 'show-add-recipe']
}
</script> 