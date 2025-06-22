<template>
  <div class="w-full h-screen flex flex-col items-center justify-center">
    <h1 class="text-5xl font-bold text-white mb-8">Sheikah Plate</h1>
    <button @click="$emit('show-recipes')" class="text-white text-2xl font-semibold bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-8 py-4 transition-all duration-300">
      View Recipes
    </button>
  </div>
</template>

<script>
export default {
  name: 'ViewHome',
  emits: ['show-recipes']
}
</script> 