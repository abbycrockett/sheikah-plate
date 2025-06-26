<template>
  <div class="add-recipe-container">
    <!-- Cropping Modal -->
    <div v-if="cropping" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div class="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full flex flex-col items-center">
        <h2 class="text-lg font-bold mb-4">Crop your image</h2>
        <Cropper
          ref="cropperRef"
          :src="cropSrc"
          :stencil-props="{ aspectRatio: 1 }"
          class="w-80 h-80 bg-gray-100 mb-4"
        />
        <div class="flex gap-4 mt-2">
          <button @click="applyCrop" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Crop & Use</button>
          <button @click="cancelCrop" class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
        </div>
      </div>
    </div>
    <!-- Main Form (hidden when cropping) -->
    <div v-else>
      <!-- Header with back button -->
      <div class="relative z-20 flex items-center justify-between p-6">
        <button 
          @click="$emit('back-to-home')"
          class="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl px-6 py-2 transition-all duration-300 group"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span class="text-white font-semibold whitespace-nowrap">Back to Home</span>
        </button>
        <h1 class="page-title text-4xl font-bold text-white text-shadow-gold text-center w-full">
          Create a New Recipe
        </h1>
        <div class="w-32"></div>
      </div>

      <!-- Main Form Content -->
      <div class="relative z-20 flex-1 flex justify-center items-start p-6">
        <div class="form-card bg-white/20 border border-[#223A5E]/80 backdrop-blur-md shadow-2xl rounded-xl p-8 max-w-6xl w-full">

          <!-- Form Content -->
          <div class="form-content grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <!-- Left Column -->
            <div class="space-y-6">
              <!-- Recipe Name -->
              <div class="form-group">
                <label for="recipe-name" class="form-label !text-white">Recipe Name</label>
                <input 
                  type="text" 
                  id="recipe-name" 
                  v-model="recipe.name" 
                  placeholder="e.g., Mushroom Skewer"
                  class="form-input"
                />
              </div>
              
              <!-- Recipe Category -->
              <div class="form-group">
                <label class="form-label !text-white">Category</label>
                <div class="category-buttons">
                  <button 
                    v-for="category in categories" 
                    :key="category"
                    @click="recipe.category = category"
                    :class="[
                      'category-btn',
                      recipe.category === category ? 'category-btn-active' : 'category-btn-inactive'
                    ]"
                  >
                    {{ category }}
                  </button>
                </div>
              </div>
              
              <!-- Photo Upload -->
              <div class="form-group">
                <label class="form-label !text-white">Recipe Photo</label>
                <div class="upload-area" @click="triggerFileUpload" @drop="handleFileDrop" @dragover.prevent>
                  <input 
                    ref="fileInput"
                    type="file" 
                    accept="image/*" 
                    @change="handleFileSelect" 
                    class="hidden"
                  />
                  <div v-if="!recipe.photo" class="upload-placeholder">
                    <svg class="w-12 h-12 text-[#2D8696] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                    <p class="text-[#2D8696] font-semibold">Click to upload or drag & drop</p>
                    <p class="text-[#666] text-sm">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <div v-else class="upload-preview">
                    <img :src="photoPreviewUrl" alt="Recipe preview" class="w-full h-full object-cover rounded-lg" />
                    <button @click.stop="removePhoto" class="remove-photo-btn">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Description -->
              <div class="form-group">
                <label for="recipe-description" class="form-label !text-white">Description</label>
                <textarea 
                  id="recipe-description" 
                  v-model="recipe.description" 
                  rows="4" 
                  placeholder="A simple, tasty skewer."
                  class="form-textarea"
                ></textarea>
              </div>
            </div>
            
            <!-- Right Column -->
            <div class="space-y-6">
              <!-- Ingredients -->
              <div class="form-group">
                <label for="recipe-ingredients" class="form-label !text-white">Ingredients (one per line)</label>
                <textarea 
                  id="recipe-ingredients" 
                  v-model="recipe.ingredients" 
                  placeholder="Hylian Shroom&#10;Wooden Stick&#10;Salt"
                  class="form-textarea h-32"
                ></textarea>
              </div>

              <!-- Directions -->
              <div class="form-group">
                <label for="recipe-directions" class="form-label !text-white">Directions</label>
                <textarea 
                  id="recipe-directions" 
                  v-model="recipe.directions" 
                  placeholder="1. Clean mushrooms thoroughly&#10;2. Carefully thread them onto a skewer&#10;3. Grill over an open flame until tender"
                  class="form-textarea h-32"
                ></textarea>
              </div>
              
              <!-- Hearts Rating -->
              <div class="form-group">
                <label class="form-label !text-white">Rating</label>
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
            </div>
          </div>
          
          <!-- Form Footer -->
          <div class="form-footer mt-8 pt-6 border-t border-[#2D8696]/30">
            <div class="flex justify-between items-center">
              <div class="text-sm text-[#666]">
                <span v-if="recipe.category" class="inline-block bg-[#2D8696] text-white px-3 py-1 rounded-full">
                  {{ recipe.category }}
                </span>
              </div>
              
              <button 
                @click="saveRecipe" 
                :disabled="!isFormValid"
                class="submit-button"
                :class="{ 'submit-button-disabled': !isFormValid }"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Save Recipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, computed } from 'vue';
import { useHeartRating } from '../scripts/useHeartRating.js';
import { saveRecipe as saveRecipeToStorage } from '../scripts/recipesStorage.js';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

export default {
  name: 'AddRecipe',
  components: { Cropper },
  emits: ['back-to-home', 'recipe-added'],
  setup(props, { emit }) {
    const recipe = reactive({
      name: '',
      category: '',
      photo: '',
      description: '',
      ingredients: '',
      directions: '',
    });

    const fileInput = ref(null);
    const categories = ['Breakfast', 'Entrée', 'Dessert'];

    // Heart rating logic
    const { hearts, getHeartSrc, setRating } = useHeartRating(0);

    // Form validation
    const isFormValid = computed(() => {
      return recipe.name.trim() && 
             recipe.category && 
             recipe.description.trim() && 
             recipe.ingredients.trim() && 
             recipe.directions.trim();
    });

    // File upload methods
    const triggerFileUpload = () => {
      fileInput.value?.click();
    };

    const cropping = ref(false);
    const cropSrc = ref('');
    const cropResult = ref('');
    const cropperRef = ref(null);

    const openCropper = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        cropSrc.value = e.target.result;
        cropping.value = true;
      };
      reader.readAsDataURL(file);
    };

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          alert('File size must be less than 10MB');
          return;
        }
        openCropper(file);
      }
    };

    const handleFileDrop = (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        if (file.size > 10 * 1024 * 1024) {
          alert('File size must be less than 10MB');
          return;
        }
        openCropper(file);
      }
    };

    const applyCrop = () => {
      const cropper = cropperRef.value;
      if (cropper) {
        const canvas = cropper.getResult().canvas;
        if (canvas) {
          // Compress and store as Blob
          canvas.toBlob((blob) => {
            recipe.photo = blob;
            cropping.value = false;
            cropSrc.value = '';
          }, 'image/jpeg', 0.7); // Use JPEG for better compression
        }
      }
    };

    const cancelCrop = () => {
      cropping.value = false;
      cropSrc.value = '';
    };

    const removePhoto = () => {
      recipe.photo = '';
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };

    const photoPreviewUrl = computed(() => {
      if (!recipe.photo) return '';
      if (typeof recipe.photo === 'string') return recipe.photo;
      // If it's a Blob, create an object URL
      return URL.createObjectURL(recipe.photo);
    });

    const saveRecipe = async () => {
      if (!isFormValid.value) return;
      // Add hearts rating to recipe
      const recipeToSave = {
        ...recipe,
        hearts: hearts.value,
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        picture: recipe.photo,
        ingredients: recipe.ingredients.split('\n').map(i => i.trim()).filter(Boolean),
      };
      try {
        await saveRecipeToStorage(recipeToSave);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('recipe-added'));
        }
        emit('recipe-added');
        emit('back-to-home');
      } catch (e) {
        alert('Failed to save recipe. Please try again.');
        console.error(e);
      }
    };

    return {
      recipe,
      fileInput,
      categories,
      hearts,
      getHeartSrc,
      setRating,
      isFormValid,
      triggerFileUpload,
      handleFileSelect,
      handleFileDrop,
      removePhoto,
      saveRecipe,
      cropping,
      cropSrc,
      cropperRef,
      applyCrop,
      cancelCrop,
      photoPreviewUrl,
    };
  }
}
</script>

<style scoped>
.add-recipe-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
}

.overlay-blur {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
}

.text-shadow-gold {
  text-shadow: 2px 2px 4px rgba(212, 175, 55, 0.5);
}

.form-card {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.page-title {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.form-header {
  border-bottom: 2px solid rgba(45, 134, 150, 0.2);
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2D8696;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 2px solid #2D8696;
  background-color: white;
  color: #333;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: var(--main-font);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #F1362F;
  box-shadow: 0 0 10px rgba(241, 54, 47, 0.3);
}

.category-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.category-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid;
}

.category-btn-active {
  background-color: #223A5E;
  color: #fff;
  border-color: #223A5E;
}

.category-btn-inactive {
  background-color: transparent;
  color: #fff;
  border-color: #fff;
}

.category-btn-inactive:hover {
  background-color: #223A5E;
  color: #fff;
  border-color: #223A5E;
}

.upload-area {
  border: 2px dashed #223A5E;
  background-color: #fff;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.upload-area:hover {
  border-color: #fff;
  background-color: rgba(255,255,255,0.95);
}

.upload-placeholder svg {
  transition: color 0.3s;
  color: #223A5E;
}

.upload-area:hover .upload-placeholder svg {
  color: #fff;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-preview {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
}

.upload-preview img {
  border-radius: 0.5rem;
}

.remove-photo-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: #F1362F;
  color: white;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-photo-btn:hover {
  background-color: #d42e28;
  transform: scale(1.1);
}

.hearts-container {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.heart {
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.heart:hover {
  transform: scale(1.1);
}

.submit-button {
  display: flex;
  align-items: center;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  border: 2px solid #223A5E;
  background-color: #223A5E;
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(241, 54, 47, 0.3);
}

.submit-button:hover:not(.submit-button-disabled) {
  background-color: #058696;
  color: #fff;
  border-color: #058696;
}

.submit-button-disabled {
  background-color: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.submit-button-disabled:hover {
  transform: none;
  box-shadow: none;
}

.back-button {
  box-shadow: 0 4px 8px rgba(45, 134, 150, 0.3);
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(45, 134, 150, 0.4);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .form-content {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .form-card {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .category-buttons {
    flex-direction: column;
  }
  
  .category-btn {
    text-align: center;
  }
}
</style>