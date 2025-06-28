<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white/95 backdrop-blur-md rounded-2xl p-8 max-w-4xl w-full mx-4 shadow-2xl border border-white/20">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Backup Recipes</h2>
        <button 
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content - Horizontal Layout -->
      <div class="flex gap-6">
        <!-- Export Section -->
        <div class="flex-1 bg-blue-50 rounded-xl p-4 border border-blue-200 flex flex-col">
          <div class="flex items-center mb-3">
            <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="text-lg font-semibold text-gray-800">Export Recipes</h3>
          </div>
          <p class="text-sm text-gray-600 mb-4 flex-grow">
            Back up your recipes before clearing cookies.
          </p>
          <button 
            @click="exportRecipes"
            :disabled="!hasRecipes"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Export All Recipes ({{ recipeCount }})
          </button>
        </div>

        <!-- Import Section -->
        <div class="flex-1 bg-green-50 rounded-xl p-4 border border-green-200 flex flex-col">
          <div class="flex items-center mb-3">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <h3 class="text-lg font-semibold text-gray-800">Import Recipes</h3>
          </div>
          <p class="text-sm text-gray-600 mb-4 flex-grow">
            Restore your recipes from a backup file.
          </p>
          
          <!-- Warning inside import section -->
          <div v-if="hasRecipes" class="mb-4 bg-blue-100 rounded-lg p-2 border border-blue-300">
            <div class="flex items-center">
              <img src="/assets/ui-assets/navi.svg" alt="Navi" class="w-5 h-5 mr-1 flex-shrink-0" />
              <span class="text-xs text-blue-800">
                Hey Listen! This will clear your {{ recipeCount }} recipe{{ recipeCount !== 1 ? 's' : '' }}.
              </span>
            </div>
          </div>
          
          <!-- File Input -->
          <div class="relative">
            <input 
              ref="fileInput"
              type="file" 
              accept=".json"
              @change="handleFileSelect"
              class="hidden"
            />
            <button 
              @click="$refs.fileInput.click()"
              class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              Choose Backup File
            </button>
          </div>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="message" class="mt-4 p-3 rounded-lg" :class="messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { loadRecipes, saveRecipe, clearRecipes } from '../scripts/recipesStorage.js'

export default {
  name: 'BackupModal',
  emits: ['close', 'recipes-imported'],
  setup(props, { emit }) {
    const recipes = ref([])
    const message = ref('')
    const messageType = ref('success')
    const fileInput = ref(null)

    const recipeCount = computed(() => recipes.value.length)
    const hasRecipes = computed(() => recipes.value.length > 0)

    // Load current recipes
    const loadCurrentRecipes = async () => {
      try {
        recipes.value = await loadRecipes()
      } catch (error) {
        console.error('Error loading recipes:', error)
        showMessage('Error loading recipes', 'error')
      }
    }

    const showMessage = (msg, type = 'success') => {
      message.value = msg
      messageType.value = type
      setTimeout(() => {
        message.value = ''
      }, 5000)
    }

    const exportRecipes = async () => {
      try {
        if (recipes.value.length === 0) {
          showMessage('No recipes to export', 'error')
          return
        }

        // Process recipes to handle image data properly
        const processedRecipes = await Promise.all(recipes.value.map(async (recipe) => {
          const processedRecipe = { ...recipe }
          
          // Handle picture field - convert Blob to base64 if needed
          if (recipe.picture) {
            if (recipe.picture instanceof Blob) {
              // Convert Blob to base64
              const base64 = await new Promise((resolve) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.readAsDataURL(recipe.picture)
              })
              processedRecipe.picture = base64
            }
            // If it's already a string (base64 or URL), keep it as is
          }
          
          return processedRecipe
        }))

        // Create backup data with metadata
        const backupData = {
          version: '1.0',
          exportDate: new Date().toISOString(),
          recipeCount: processedRecipes.length,
          recipes: processedRecipes
        }

        // Create and download file
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `sheikah-plate-recipes-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        showMessage(`Successfully exported ${recipes.value.length} recipes!`)
      } catch (error) {
        console.error('Error exporting recipes:', error)
        showMessage('Error exporting recipes', 'error')
      }
    }

    const handleFileSelect = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      try {
        const text = await file.text()
        const backupData = JSON.parse(text)

        // Validate backup file structure
        if (!backupData.recipes || !Array.isArray(backupData.recipes)) {
          showMessage('Invalid backup file format', 'error')
          return
        }

        // Clear all current recipes before importing
        await clearRecipes()

        // Import recipes
        let importedCount = 0
        for (const recipe of backupData.recipes) {
          try {
            // Process recipe to handle image data properly
            const processedRecipe = { ...recipe }
            
            // Handle picture field - convert base64 back to Blob if needed
            if (recipe.picture && typeof recipe.picture === 'string') {
              if (recipe.picture.startsWith('data:image/')) {
                // Convert base64 back to Blob
                const response = await fetch(recipe.picture)
                const blob = await response.blob()
                processedRecipe.picture = blob
              }
              // If it's a URL (not base64), keep it as is
            }
            
            await saveRecipe(processedRecipe)
            importedCount++
          } catch (error) {
            console.error('Error importing recipe:', recipe.name, error)
          }
        }

        // Clear file input
        if (fileInput.value) {
          fileInput.value.value = ''
        }

        showMessage(`Successfully imported ${importedCount} recipes!`)
        emit('recipes-imported')
      } catch (error) {
        console.error('Error importing recipes:', error)
        showMessage('Error reading backup file. Please make sure it\'s a valid backup file.', 'error')
      }
    }

    // Load recipes on mount
    loadCurrentRecipes()

    return {
      recipes,
      recipeCount,
      hasRecipes,
      message,
      messageType,
      fileInput,
      exportRecipes,
      handleFileSelect
    }
  }
}
</script> 