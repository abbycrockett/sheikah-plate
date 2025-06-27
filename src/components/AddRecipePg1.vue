<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- Back Button -->
    <div class="absolute top-6 left-6 z-20">
      <button 
        @click="$emit('back-to-home')"
        class="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl px-4 py-2 transition-all duration-300 group"
      >
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        <span class="text-white font-semibold">Back to Home</span>
      </button>
    </div>
    
    <!-- Kakariko background, left-aligned -->
    <img
      src="/assets/ui-assets/kakariko-bg.png"
      alt="Kakariko Background"
      class="absolute left-0 top-0 h-full object-left object-cover select-none pointer-events-none"
      draggable="false"
    />
    <!-- Add background SVG, left-aligned a bit past center -->
    <img
      src="/assets/ui-assets/add-bg.svg"
      alt="Add Background"
      class="absolute top-1/2 left-[20%] transform -translate-y-1/2 select-none pointer-events-none"
      draggable="false"
      style="z-index: 1; max-height: 100vh; width: 110%;"
    />
    <!-- Form content -->
    <div class="relative z-10 flex flex-col items-end justify-start h-full w-full mt-12 pr-24">
      <form class="max-w-lg w-full flex flex-col gap-6">
        <!-- Recipe Name -->
        <div>
          <label for="recipe-name" class="recipe-label">Recipe Name</label>
          <input
            id="recipe-name"
            v-model="recipeName"
            type="text"
            placeholder="e.g., Mushroom Skewer"
            class="recipe-input"
          />
        </div>
        <!-- Category -->
        <div>
          <label class="recipe-label">Category</label>
          <div class="flex gap-3">
            <button
              v-for="cat in categories"
              :key="cat"
              type="button"
              @click="recipeCategory = cat"
              :class="[
                'category-button',
                recipeCategory === cat ? 'category-button-active' : 'category-button-inactive'
              ]"
            >
              {{ cat }}
            </button>
          </div>
        </div>
        <!-- Image Upload -->
        <div>
          <label class="recipe-label">Recipe Image</label>
          <div class="flex flex-col items-start gap-2">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="onFileChange"
              class="hidden"
            />
            <div
              class="upload-box"
              @click="triggerFileInput"
            >
              <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="upload-preview" />
              <div v-else class="upload-placeholder">
                <img src="/assets/ui-assets/camera-rune.svg" alt="Camera" class="camera-icon" />
                <span class="upload-text">Click to upload</span>
                <span class="upload-subtext">PNG, JPG, GIF up to 10MB</span>
              </div>
            </div>
            <button v-if="imagePreview" type="button" class="remove-image-button" @click="removeImage">Remove Image</button>
          </div>
        </div>
      </form>
    </div>
    
    <!-- Next Page Button -->
    <div class="absolute bottom-12 right-12 z-20">
      <button 
        @click="$emit('next-page')"
        class="flex items-center space-x-2 bg-[#3E2A1A]/80 hover:bg-[#3E2A1A] border border-[#3E2A1A] hover:border-[#5C3B1E] rounded-xl px-4 py-2 transition-all duration-300 group"
      >
        <span class="text-white font-semibold">Next Page</span>
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddRecipePg1',
  emits: ['back-to-home', 'next-page'],
  data() {
    return {
      recipeName: '',
      recipeCategory: '',
      categories: ['Breakfast', 'Entrée', 'Dessert'],
      imageFile: null,
      imagePreview: '',
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        this.imageFile = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    removeImage() {
      this.imageFile = null;
      this.imagePreview = '';
      this.$refs.fileInput.value = '';
    },
  },
};
</script>

<style scoped>
.recipe-label {
  display: block;
  font-size: 22px;
  font-weight: 620;
  margin-bottom: 8px;
  color: #3E2A1A; 
}

.recipe-input {
  width: 65%;
  padding: 0.5rem 0.75rem;
  border: 2px solid #3E2A1A;
  border-radius: 0.75rem;
  background-color: #FAF6E9;
  color: #3E2A1A;
  font-size: 16px;
  transition: all 0.2s ease-in-out;
}

.recipe-input:focus {
  outline: none;
  border-color: #A1712E;
  background-color: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(161, 113, 46, 0.1);
  transform: translateY(-1px);
}

.recipe-input::placeholder {
  color: #8B7355;
  opacity: 0.7;
}

.upload-box {
  width: 160px;
  height: 160px;
  border: 2px solid #3E2A1A;
  border-radius: 0.75rem;
  background-color: #FAF6E9;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-box:hover {
  border-color: #A1712E;
  background-color: #FFFFFF;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(62, 42, 26, 0.1);
}

.upload-box:hover .camera-icon {
  content: url('/assets/ui-assets/camera-rune-hover.svg');
}

.upload-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
}

.upload-text {
  font-size: 16px;
  font-weight: 600;
  color: #3E2A1A;
  margin-bottom: 2px;
  margin-top: -8px;
}

.upload-subtext {
  font-size: 14px;
  color: #8B7355;
  opacity: 0.8;
}

.camera-icon {
  width: 72px;
  height: 72px;
  margin-bottom: 1px;
}

.category-button {
  padding: 0.5rem 0.75rem;
  border: 2px solid #3E2A1A; 
  border-radius: 0.75rem;
  font-weight: 600;
  color: #3E2A1A;
  transition: all 0.2s ease-in-out;
}

.category-button:hover {
  background-color: #a27e4a; 
  color: #FFFFFF;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(62, 42, 26, 0.2);
}

.category-button-active {
  background-color: #A1712E;; 
  color: #FAF6E9; 
  border-color: #443505;
}

.category-button-inactive {
  color: #3E2A1A; 
}

.remove-image-button {
  padding: 0.2rem 0.4rem;
  border: 1px solid #3E2A1A;
  border-radius: 0.75rem;
  font-weight: 600;
  color: #5C3B1E; 
  background-color: #E7C88C; 
  transition: all 0.2s ease-in-out;
  margin-top: 8px;
}

.remove-image-button:hover {
  background-color: #C09E62; 
  color: #3E2A1A;
  transform: translateY(-1px);
}
</style> 