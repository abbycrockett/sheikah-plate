<template>
  <div class="menu-bar w-full">
    <div class="hearts-container">
      <img src="/assets/ui-assets/bar-hearts.png" alt="Hearts" class="hearts-icon" style="user-select: none;" draggable="false" />
    </div>
    <div class="menu-content">
      <div class="title-section">
        <div class="title-row">
          <img v-if="currentView === 'recipes'" src="/assets/ui-assets/l-button.png" alt="L Button" class="l-button" @click="$emit('switch-adventure-log')" style="cursor:pointer;" draggable="false" />
          <h1 class="title" style="user-select: none;">{{ titleText }}</h1>
          <img v-if="currentView === 'adventure-log'" src="/assets/ui-assets/r-button.png" alt="R Button" class="r-button" @click="$emit('switch-recipes')" style="cursor:pointer;" draggable="false" />
        </div>
        <div class="circles-container" style="user-select: none;">
          <div class="circle" :class="leftCircleClass" style="user-select: none;" draggable="false"></div>
          <div class="circle" :class="rightCircleClass" style="user-select: none;" draggable="false"></div>
        </div>
      </div>
    </div>
    <div v-if="showRupees" class="rupee-container">
      <img src="/assets/ui-assets/rupee.png" alt="Rupee" class="rupee-icon" style="user-select: none;" draggable="false" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuBar',
  props: {
    currentView: {
      type: String,
      default: 'home'
    },
    showRupees: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    titleText() {
      return this.currentView === 'adventure-log' ? 'Adventure Log' : 'Recipes';
    },
    leftCircleClass() {
      return this.currentView === 'adventure-log' ? 'left-circle' : 'right-circle';
    },
    rightCircleClass() {
      return this.currentView === 'adventure-log' ? 'right-circle' : 'left-circle';
    }
  }
}
</script>

<style scoped>
.menu-bar {
  background: #D9D9D9;
  width: 100%;
  height: 58px;
  min-height: 58px;
  max-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
}

.menu-content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.title {
  font-weight: bold;
  color: black;
  font-size: 22px;
  margin: 0;
  line-height: 1.3;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  position: relative;
}

.l-button {
  position: absolute;
  left: -100px;
  width: 72px;
  height: 72px;
  object-fit: contain;
  bottom: -26px;
}

.r-button {
  position: absolute;
  right: -83px;
  width: 42px;
  height: 42px;
  object-fit: contain;
  bottom: -12.5px;
}

.circles-container {
  display: flex;
  gap: 4px;
  align-items: center;
}

.circle {
  width: 4px;
  height: 4px;
  border-radius: 50%;
}

.left-circle {
  background-color: #131313;
}

.right-circle {
  background-color: #66645D;
}

.rupee-container {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.rupee-icon {
  width: 72px;
  height: 72px;
  object-fit: contain;
}

.hearts-container {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hearts-icon {
  width: 172px;
  height: 172px;
  object-fit: contain;
}
</style> 