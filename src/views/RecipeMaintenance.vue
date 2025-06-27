<template>
  <div class="w-full h-screen flex flex-col items-center justify-center">
    <AddRecipePg1 
      v-if="currentPage === 1" 
      @back-to-home="$emit('back-to-home')" 
      @next-page="currentPage = 2" 
    />
    <AddRecipePg2 
      v-else-if="currentPage === 2" 
      @back-to-home="$emit('back-to-home')" 
      @previous-page="currentPage = 1" 
    />
  </div>
</template>

<script>
import AddRecipePg1 from '../components/AddRecipePg1.vue';
import AddRecipePg2 from '../components/AddRecipePg2.vue';

export default {
  name: 'RecipeMaintenance',
  components: {
    AddRecipePg1,
    AddRecipePg2
  },
  emits: ['back-to-home'],
  data() {
    return {
      currentPage: 1
    };
  },
  mounted() {
    window.addEventListener('keydown', this.handleArrowNav);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleArrowNav);
  },
  methods: {
    handleArrowNav(e) {
      const tag = e.target.tagName;
      const isEditable = e.target.isContentEditable;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || isEditable) return;
      if (e.key === 'ArrowLeft' && this.currentPage === 2) {
        this.currentPage = 1;
      } else if (e.key === 'ArrowRight' && this.currentPage === 1) {
        this.currentPage = 2;
      }
    }
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