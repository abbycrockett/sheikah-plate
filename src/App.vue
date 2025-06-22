<template>
  <div id="app" class="w-full h-screen">
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
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import ViewHome from './views/ViewHome.vue';
import ViewRecipes from './views/ViewRecipes.vue';
import RecipeMaintenance from './views/RecipeMaintenance.vue';

export default {
  name: 'App',
  components: {
    ViewHome,
    ViewRecipes,
    RecipeMaintenance
  },
  setup() {
    const currentView = ref('home');

    watch(currentView, (newView) => {
      console.log('Current view is now:', newView);
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
</style>
