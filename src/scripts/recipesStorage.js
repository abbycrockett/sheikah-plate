// Utility for saving and loading recipes from localStorage
const STORAGE_KEY = 'sheikah_plate_recipes';

export function loadRecipes() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export function saveRecipe(recipe) {
  const recipes = loadRecipes();
  recipes.push(recipe);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export function clearRecipes() {
  localStorage.removeItem(STORAGE_KEY);
} 