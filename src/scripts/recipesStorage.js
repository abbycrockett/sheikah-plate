// Utility for saving and loading recipes from localStorage
const STORAGE_KEY = 'sheikah_plate_recipes';

// Migration function to ensure all recipes have a category property
function migrateRecipes(recipes) {
  return recipes.map(recipe => {
    if (!recipe.category) {
      // Assign default category based on recipe name for existing recipes
      let defaultCategory = 'Entrée'; // default
      if (recipe.name.includes('Cake') || recipe.name.includes('Candy')) {
        defaultCategory = 'Dessert';
      } else if (recipe.name.includes('Skewer')) {
        defaultCategory = 'Breakfast';
      }
      recipe.category = defaultCategory;
    }
    return recipe;
  });
}

export function loadRecipes() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    const recipes = JSON.parse(data);
    const migratedRecipes = migrateRecipes(recipes);
    // Save migrated recipes back to localStorage
    if (migratedRecipes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedRecipes));
    }
    return migratedRecipes;
  } catch (e) {
    return [];
  }
}

export function saveRecipe(recipe) {
  const recipes = loadRecipes();
  recipes.push(recipe);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export function deleteRecipe(recipeId) {
  const recipes = loadRecipes();
  const filteredRecipes = recipes.filter(recipe => recipe.id !== recipeId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecipes));
}

export function clearRecipes() {
  localStorage.removeItem(STORAGE_KEY);
} 