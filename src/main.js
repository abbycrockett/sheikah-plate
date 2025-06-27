import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';
import ViewHome from './views/ViewHome.vue';
import EditRecipeForm from './components/EditRecipeForm.vue';
import ViewRecipes from './views/ViewRecipes.vue';
import AdventureLog from './views/AdventureLog.vue';
import RecipeMaintenance from './views/RecipeMaintenance.vue';

const routes = [
  { path: '/', name: 'Home', component: ViewHome },
  { path: '/recipes', name: 'Recipes', component: ViewRecipes },
  { path: '/adventure-log', name: 'AdventureLog', component: AdventureLog },
  { path: '/add', name: 'AddRecipe', component: RecipeMaintenance },
  { path: '/edit/:id', name: 'EditRecipe', component: EditRecipeForm, props: true },
  // You can add an add route if needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount('#app'); 