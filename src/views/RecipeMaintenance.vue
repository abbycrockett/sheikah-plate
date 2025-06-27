<template>
  <div class="w-full h-screen flex flex-col items-center justify-center">
    <AddRecipeForm 
      @back-to-home="goHome"
      @save="handleSave"
    />
  </div>
</template>

<script>
import AddRecipeForm from '../components/AddRecipeForm.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'RecipeMaintenance',
  components: {
    AddRecipeForm
  },
  setup() {
    const router = useRouter();
    function goHome() {
      router.push({ name: 'Home' });
    }
    function handleSave(recipe) {
      // For now, just log the recipe. You can add storage logic here.
      console.log('Recipe to save:', recipe);
      goHome();
    }
    return { goHome, handleSave };
  }
}
</script>

<style scoped>
.action-btn-compact {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.action-btn-compact:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
</style> 