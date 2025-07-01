<template>
  <button
    class="quest-item-outer"
    :class="{ 
      'quest-item-disabled': disabled,
      'quest-item-completed': isCompleted
    }"
    :style="style"
    :disabled="disabled"
    @click="handleClick"

  >
    <span class="quest-item-icon-wrapper">
      <img :src="iconToUse" alt="Quest Icon" class="quest-item-icon" draggable="false" />
    </span>
    <span class="quest-item-textblock">
      <span class="quest-item-label">{{ label }}</span>
      <span v-if="location" class="quest-item-location">{{ location }}</span>
    </span>
    <span v-if="!isCompleted" class="quest-item-svg-corner">
      <svg viewBox="0 0 28 78" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <path opacity="0.6" fill-rule="evenodd" clip-rule="evenodd" d="M28 0H0V78H28V0ZM14 43C16.2091 43 18 41.2091 18 39C18 36.7909 16.2091 35 14 35C11.7909 35 10 36.7909 10 39C10 41.2091 11.7909 43 14 43Z" fill="#66645D"/>
      </svg>
      <img v-if="showQuestMarker" src="/assets/ui-assets/quest-marker.png" class="quest-marker-img" alt="Quest Marker" draggable="false" />
    </span>
    <div
      class="quest-item-inner"
      :class="{ 'quest-item-focused': shouldShowFocus }"
      :style="{ borderColor: borderColor }"
    >
      <transition name="quest-traingle-fade">
        <div v-if="shouldShowFocus" class="quest-item-traingles">
          <img src="/assets/ui-assets/quest-triangle-tl.png" class="quest-traingle-img quest-traingle-tl" alt="traingle" draggable="false" />
          <img src="/assets/ui-assets/quest-triangle-tr.png" class="quest-traingle-img quest-traingle-tr" alt="traingle" draggable="false" />
          <img src="/assets/ui-assets/quest-triangle-bl.png" class="quest-traingle-img quest-traingle-bl" alt="traingle" draggable="false" />
          <img src="/assets/ui-assets/quest-triangle-br.png" class="quest-traingle-img quest-traingle-br" alt="traingle" draggable="false" />
        </div>
      </transition>
    </div>
  </button>
</template>

<script>
export default {
  name: 'QuestItem',
  props: {
    label: { type: String, required: true },
    location: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    style: { type: [Object, String], default: null },
    icon: { type: String, default: '' },
    showQuestMarker: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    isSelected: { type: Boolean, default: false },
    isHovered: { type: Boolean, default: false },
    anyQuestHovered: { type: Boolean, default: false },
  },
  data() {
    return {
      // No local state needed - using global hover state
    };
  },
  computed: {
    iconToUse() {
      return this.icon || '/assets/ui-assets/quest.png';
    },
    borderColor() {
      return this.shouldShowFocus ? '#FDFEE7' : '#3A3A3A'; // Glow or normal
    },
    shouldShowFocus() {
      // If any quest is being hovered, only show focus on the hovered quest
      if (this.anyQuestHovered && this.isHovered) return true;
      // If no quest is being hovered, show focus on the selected quest
      if (!this.anyQuestHovered && this.isSelected) return true;
      return false;
    },
    traingleStyle() {
      return {
        borderColor: '#FDFEE7',
      };
    },
  },
  methods: {
    handleClick(e) {
      if (!this.disabled) {
        this.$emit('click', e);
      }
    },
  },
};
</script>

<style scoped>
.quest-item-outer {
  padding: 0.25rem 2.0rem;
  cursor: pointer;
  font-family: inherit;
  border: none;
  box-sizing: border-box;
  background: #232323dd;
  border-radius: 0.125rem;
  position: relative;
  outline: none;
  transition: filter 0.2s;
  display: flex;
  align-items: center;
  gap: 0.8em;
  justify-content: flex-start;
  padding-left: 3.2em;
  overflow: visible;
}
.quest-item-disabled {
  filter: brightness(0.5);
  cursor: not-allowed;
}
.quest-item-completed {
  opacity: 0.7;
  filter: grayscale(0.3);
  transition: opacity 0.2s, filter 0.2s;
}
.quest-item-completed:hover {
  opacity: 0.7;
  filter: grayscale(0.3);
}
.quest-item-completed:hover .quest-item-inner {
  opacity: 1;
  filter: none;
}
.quest-item-completed:hover .quest-item-traingles {
  opacity: 1;
  filter: none;
}
.quest-item-icon-wrapper {
  position: absolute;
  left: 0.8em;
  top: 50%;
  transform: translateY(-50%);
  height: 2.6em;
  width: 2.6em;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.quest-item-icon {
  height: 2.6em;
  width: 2.6em;
  object-fit: contain;
  display: block;
}
.quest-item-textblock {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 0.9em;
  justify-content: center;
}
.quest-item-label {
  color: #fff;
  font-size: 1.37em;
  font-weight: 700;
  z-index: 2;
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 0.15em;
  font-style: italic;
}
.quest-item-location {
  color: #E1C139;
  font-size: 0.88em;
  font-weight: 600;
  margin-left: 0.20em;
  margin-top: -.4em;
  font-style: italic;
  letter-spacing: 0.01em;
}
.quest-item-inner {
  box-sizing: border-box;
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  border-style: solid;
  border-width: 1px;
  position: absolute;
  top: 2px;
  left: 2px;
  border-radius: 0.125rem;
  pointer-events: none;
  z-index: 1;
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: visible;
}
.quest-item-focused {
  box-shadow: 0px 0px 10px 2px rgba(252, 254, 231, 0.9);
}
.quest-item-traingles {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100%; height: 100%;
  z-index: 3;
  pointer-events: none;
  overflow: visible;
}
.quest-traingle-img {
  position: absolute;
  width: 8px;
  height: 8px;
  pointer-events: none;
  user-select: none;
  animation: quest-traingle-bounce .8s ease-in-out infinite;
}
.quest-traingle-tl {
  top: 0;
  left: 0;
  --traingle-x: -65%;
  --traingle-y: -65%;
}
.quest-traingle-tr {
  top: 0;
  right: 0;
  --traingle-x: 65%;
  --traingle-y: -65%;
}
.quest-traingle-bl {
  bottom: 0;
  left: 0;
  --traingle-x: -65%;
  --traingle-y: 65%;
}
.quest-traingle-br {
  bottom: 0;
  right: 0;
  --traingle-x: 65%;
  --traingle-y: 65%;
}
@keyframes quest-traingle-bounce {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(var(--traingle-x), var(--traingle-y)) scale(1.4);
  }
}
.quest-traingle-fade-enter-active, .quest-traingle-fade-leave-active {
  transition: opacity 0.2s;
}
.quest-traingle-fade-enter, .quest-traingle-fade-leave-to {
  opacity: 0;
}
.quest-item-svg-corner {
  position: absolute;
  right: 2px;
  top: 2px;
  height: calc(100% - 4px);
  width: 19px;
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 2;
  justify-content: center;
}
.quest-marker-img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  pointer-events: none;
  z-index: 3;
}
</style> 