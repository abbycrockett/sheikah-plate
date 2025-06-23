<template>
  <div class="add-recipe-form">
    <h2 class="form-title">Create New Recipe</h2>
    
    <div class="form-content">
      <!-- Left Column -->
      <div class="form-column">
        <!-- Recipe Name -->
        <div class="form-group">
          <label for="recipe-name">Recipe Name</label>
          <input type="text" id="recipe-name" v-model="recipe.name" placeholder="e.g., Mushroom Skewer">
        </div>
        
        <!-- Photo URL -->
        <div class="form-group">
          <label for="recipe-photo">Photo URL</label>
          <input type="text" id="recipe-photo" v-model="recipe.photo" placeholder="Enter image URL">
        </div>
        
        <!-- Description -->
        <div class="form-group">
          <label for="recipe-description">Description</label>
          <textarea id="recipe-description" v-model="recipe.description" rows="4" placeholder="A simple, tasty skewer."></textarea>
        </div>
      </div>
      
      <!-- Right Column -->
      <div class="form-column">
        <!-- Ingredients -->
        <div class="form-group form-group-expanding">
          <label for="recipe-ingredients">Ingredients (one per line)</label>
          <textarea id="recipe-ingredients" v-model="recipe.ingredients" placeholder="Hylian Shroom..."></textarea>
        </div>

        <!-- Directions -->
        <div class="form-group form-group-expanding">
          <label for="recipe-directions">Directions</label>
          <textarea id="recipe-directions" v-model="recipe.directions" placeholder="Cook over an open flame..."></textarea>
        </div>
      </div>
    </div>
    
    <div class="form-footer">
      <!-- Hearts Rating -->
      <div class="form-group">
        <label>Rating</label>
        <div class="hearts-container">
          <img
            v-for="n in 5"
            :key="n"
            :src="getHeartSrc(n)"
            @click="setRating(n, $event)"
            class="heart"
            alt="heart"
          />
        </div>
      </div>
      
      <button class="submit-button">Save Recipe</button>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useHeartRating } from '../scripts/useHeartRating.js';

export default {
  name: 'AddRecipe',
  setup() {
    const recipe = reactive({
      name: '',
      photo: '',
      description: '',
      ingredients: '',
      directions: '',
    });

    // The heart rating logic is now managed by the composable.
    // The `hearts` value can be accessed later when submitting the form.
    const { hearts, getHeartSrc, setRating } = useHeartRating(0);

    return {
      recipe,
      getHeartSrc,
      setRating,
    };
  }
}
</script>

<style scoped>
.add-recipe-form {
  width: 100%;
  height: 100vh; /* Use height instead of min-height */
  padding: 2rem 3rem; /* Adjusted padding */

  border: 2px solid #5fdeff;
  box-shadow: 0 0 20px #5fdeff, inset 0 0 10px #5fdeff;
  color: #e0f7ff;
  font-family: var(--main-font);
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Allow scrolling */
}

.form-content {
  display: flex;
  gap: 2rem;
  flex-grow: 1; /* Allow content to fill space */
  min-height: 0; /* Fix flexbox overflow issue in some browsers */
}

.form-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Fix flexbox overflow issue */
}

.form-group-expanding {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.form-group-expanding textarea {
  flex-grow: 1;
  resize: none; /* Disable manual resize */
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  border-top: 1px solid #3a8a9e;
  padding-top: 1.5rem;
}

.form-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #5fdeff;
  margin-bottom: 2rem;
  text-shadow: 0 0 5px #5fdeff;
}

.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #9adbe8;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #3a8a9e;
  background-color: #081422;
  color: #e0f7ff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #5fdeff;
  box-shadow: 0 0 10px #5fdeff;
}

.hearts-container {
  display: flex;
  gap: 0.5rem;
}

.heart {
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.heart:hover {
  transform: scale(1.1);
}

.submit-button {
  align-self: flex-end; /* Align button to the right of the footer */
  padding: 0.75rem 2rem; /* Adjusted padding */
  border-radius: 0.5rem;
  border: 2px solid #5fdeff;
  background-color: transparent;
  color: #5fdeff;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 0 5px #5fdeff;
}

.submit-button:hover {
  background-color: #5fdeff;
  color: #0c1a2e;
  box-shadow: 0 0 15px #5fdeff;
}
</style>