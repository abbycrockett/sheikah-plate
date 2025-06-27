<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- Back Button -->
    <div class="absolute top-6 left-6 z-20">
      <button 
        @click="$emit('previous-page')"
        class="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl px-4 py-2 transition-all duration-300 group"
      >
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        <span class="text-white font-semibold">Previous Page</span>
      </button>
    </div>
    
    <img
      src="/assets/ui-assets/link-happy-bg.png"
      alt="Kakariko Background"
      class="absolute left-0 top-0 h-full object-left object-cover select-none pointer-events-none"
      draggable="false"
    />
   
    <img
      src="/assets/ui-assets/add-bg.svg"
      alt="Add Background"
      class="absolute top-1/2 left-[20%] transform -translate-y-1/2 select-none pointer-events-none"
      draggable="false"
      style="z-index: 1; max-height: 100vh; width: 110%;"
    />
    
    <!-- Page 2 Content -->
    <div class="relative z-10 flex flex-col items-end justify-start h-full w-full mt-12 pr-44">
      <div class="max-w-md w-full flex flex-col gap-3">
        <!-- Description -->
        <div>
          <label for="description" class="recipe-label">Description</label>
          <textarea id="description" class="recipe-textarea" rows="2" placeholder="A simple, tasty skewer."></textarea>
        </div>
        <!-- Rating -->
        <div>
          <label class="recipe-label">Rating</label>
          <div class="hearts-container">
            <img
              v-for="n in 5"
              :key="n"
              :src="getHeartSrc(n)"
              @click="setRating(n, $event)"
              class="heart compact-heart"
              alt="heart"
            />
          </div>
        </div>
        <!-- Ingredients -->
        <div>
          <label for="ingredients" class="recipe-label">Ingredients (one per line)</label>
          <textarea id="ingredients" class="recipe-textarea" rows="3" placeholder="Hylian Shroom
Wooden Stick
Salt"></textarea>
        </div>
        <!-- Directions -->
        <div>
          <label for="directions" class="recipe-label">Directions</label>
          <textarea id="directions" class="recipe-textarea" rows="5" placeholder="1. Clean mushrooms thoroughly
2. Carefully thread them onto a skewer
3. Grill over an open flame until tender"></textarea>
        </div>
      </div>
      <!-- Save Button -->
      <div class="absolute bottom-20 right-12 z-20">
        <button class="flex items-center space-x-2 bg-[#3E2A1A] hover:bg-[#EC6934] text-white font-bold rounded-xl px-8 py-3 shadow-lg transition-all duration-300 border-2 border-transparent hover:border-[#75430D]">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21C12 21 4 13.684 4 8.857C4 5.613 6.686 3 9.857 3C11.429 3 12.857 3.857 13.714 5.143C14.571 3.857 16 3 17.571 3C20.743 3 23.429 5.613 23.429 8.857C23.429 13.684 16 21 16 21H12Z"/>
          </svg>
          <span>Save</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useHeartRating } from '../scripts/useHeartRating.js';

export default {
  name: 'AddRecipePg2',
  emits: ['back-to-home', 'previous-page'],
  setup() {
    // Use the heart rating composable
    const { hearts, getHeartSrc, setRating } = useHeartRating(0);
    return {
      hearts,
      getHeartSrc,
      setRating,
    };
  },
};
</script>

<style scoped>
.recipe-label {
  display: block;
  font-size: 21px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #3E2A1A;
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
</style>