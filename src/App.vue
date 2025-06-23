<template>
  <div id="app" class="w-full h-screen">
    <GlobalOverlay />
    <ViewHome 
      v-if="currentView === 'home'" 
      @show-recipes="currentView = 'recipes'" 
      @show-add-recipe="currentView = 'add-recipe'" 
    />
    <ViewRecipes 
      v-else-if="currentView === 'recipes'" 
      @back-to-home="currentView = 'home'" 
    />
    <RecipeMaintenance 
      v-else-if="currentView === 'add-recipe'" 
      @back-to-home="currentView = 'home'" 
    />
    <AdventureLog 
      v-else-if="currentView === 'adventure-log'" 
    />
  </div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import GlobalOverlay from './components/GlobalOverlay.vue';
import ViewHome from './views/ViewHome.vue';
import ViewRecipes from './views/ViewRecipes.vue';
import RecipeMaintenance from './views/RecipeMaintenance.vue';
import AdventureLog from './views/AdventureLog.vue';

export default {
  name: 'App',
  components: {
    GlobalOverlay,
    ViewHome,
    ViewRecipes,
    RecipeMaintenance,
    AdventureLog
  },
  setup() {
    const currentView = ref('home');

    watch(currentView, (newView) => {
      console.log('Current view is now:', newView);
    });

    function handleKeydown(e) {
      if (currentView.value === 'home' && (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'l')) {
        currentView.value = 'adventure-log';
      } else if (currentView.value === 'adventure-log' && (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'r')) {
        currentView.value = 'home';
      }
    }

    onMounted(() => {
      window.addEventListener('keydown', handleKeydown);
    });
    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeydown);
    });

    return {
      currentView
    };
  }
}
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  padding: 0;
}

.al-content-wrapper {
  position: absolute;
  right: 0;
  bottom: 100px;
  width: 60vw;
  max-width: 900px;
  min-width: 590px;
  height: auto;
  z-index: 16;
}

.al-content-overlay {
  width: 100%;
  height: auto;
  display: block;
  pointer-events: none;
  user-select: none;
}
</style>
