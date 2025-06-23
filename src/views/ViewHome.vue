<template>
  <div class="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 w-full h-full z-0">
      <img src="/assets/ui-assets/recipes-large-bg.png" alt="Background" class="w-full h-full object-cover" draggable="false" />
    </div>
    <div class="absolute inset-0 w-full h-full z-10 overlay-blur"></div>
    <MenuBar class="absolute top-0 left-0 w-full z-30" />
    <div class="relative z-20 flex flex-col items-center w-full">
      <div class="relative flex justify-center items-center w-full mb-4" style="max-width: 700px; min-width: 320px;">
        <input type="text" placeholder="Search..." class="search-input-bar w-[80%] h-[44px] bg-white text-xl text-[#222] font-semibold px-6 pr-12 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#897C4F] transition" style="border:none;" />
        <svg class="absolute right-[12%] w-6 h-6 text-[#897C4F] pointer-events-none" style="top: 50%; transform: translateY(-50%);" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </div>
      <div class="flex flex-wrap justify-center gap-2 mb-8">
        <button
          v-for="filter in filters"
          :key="filter"
          class="filter-btn"
          :class="{ active: selectedFilters.includes(filter) }"
          @click="toggleFilter(filter)"
        >
          {{ filter }}
        </button>
      </div>
      <div class="flex space-x-4">
        <button @click="$emit('show-recipes')" class="text-white text-2xl font-semibold bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-8 py-4 transition-all duration-300">
          View Recipes
        </button>
        <button @click="$emit('show-add-recipe')" class="text-white text-2xl font-semibold bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl px-8 py-4 transition-all duration-300">
          Add Recipe
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import MenuBar from '../components/MenuBar.vue';
export default {
  name: 'ViewHome',
  components: { MenuBar },
  emits: ['show-recipes', 'show-add-recipe'],
  setup() {
    const filters = [
      'Breakfast',
      'Lunch',
      'Dinner',
      'Snack',
      'Dessert'
    ];
    const selectedFilters = ref(['Breakfast']);
    function toggleFilter(filter) {
      const idx = selectedFilters.value.indexOf(filter);
      if (idx === -1) {
        selectedFilters.value.push(filter);
      } else {
        selectedFilters.value.splice(idx, 1);
      }
    }
    return {
      filters,
      selectedFilters,
      toggleFilter
    };
  }
}
</script>

<style scoped>
.overlay-blur {
  background: rgba(0, 0, 0, 0.30);
  backdrop-filter: blur(5px);
}
.search-input-bar::-webkit-input-placeholder {
  color: #888;
  font-weight: 500;
}
.search-input-bar::-moz-placeholder {
  color: #888;
  font-weight: 500;
}
.search-input-bar:-ms-input-placeholder {
  color: #888;
  font-weight: 500;
}
.search-input-bar::placeholder {
  color: #888;
  font-weight: 500;
}
.filter-btn {
  background: rgba(255,255,255,0.12);
  color: #fff;
  border: 2px solid #fff;
  padding: 0.5rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
}
.filter-btn.active,
.filter-btn:hover {
  background: linear-gradient(90deg, #897C4F 0%, #746734 100%);
  color: #fff;
  border-color: #897C4F;
}
</style> 