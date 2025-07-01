<template>
  <div class="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 w-full h-full z-0">
      <img src="/assets/ui-assets/adventure-log-bg.png" alt="Adventure Log Background" class="w-full h-full object-cover" draggable="false" />
    </div>
    <div class="absolute inset-0 w-full h-full z-10 overlay-blur"></div>
    <img src="/assets/ui-assets/sword-overlay.png" alt="Sword Overlay" class="sword-overlay" draggable="false" />
    
    <!-- Main Quest Section (Left Side) -->
    <div class="main-quest-wrapper">
      <div class="main-quest-header">
        <span class="main-quest-title">Main Quests</span>
      </div>
      <div class="main-quest-items">
        <QuestItem
          v-for="quest in allQuests"
          :key="quest.id"
          :label="quest.title"
          :location="quest.location"
          :showQuestMarker="quest.id === questWithMarker && quest.state === 'active'"
          :isCompleted="quest.state === 'complete'"
          :isSelected="quest.id === selectedQuest?.id"
          :isHovered="quest.id === hoveredQuestId"
          :anyQuestHovered="hoveredQuestId !== null"
          @click="onQuestClick(quest.id)"
          @mouseenter="onQuestHover(quest.id)"
          @mouseleave="onQuestLeave"
          style="min-width: 410px; max-width: 90%; margin-bottom: 0.5em;"
        />
      </div>
    </div>
    
    <div class="al-content-wrapper select-none" style="user-select: none;" draggable="false">
      <img src="/assets/ui-assets/adventure-log-content.png" alt="Adventure Log Content" class="al-content-overlay" draggable="false" />
      <div class="al-header">
        <span class="al-title">{{ selectedQuest?.title || 'Select a quest' }}</span>
        <div class="al-underline"></div>
        <div class="al-row">
          <div class="al-requestor">
            <img src="/assets/ui-assets/notification.png" alt="Notification" class="notification-icon" />
            <span class="requestor-name">{{ selectedQuest?.requestor || '' }}</span>
          </div>
          <div class="al-location">{{ selectedQuest?.location || '' }}</div>
        </div>
        <div class="al-description">
          <div v-if="selectedQuest">
            <div v-for="(line, idx) in displayedLines" :key="idx" v-html="line"></div>
          </div>
          <div v-else>Select a quest from the left to view its details.</div>
        </div>
      </div>
    </div>
    <MenuBar class="absolute top-0 left-0 w-full z-30" :currentView="'adventure-log'" 
      @switch-recipes="goToRecipes"
    />
    <div class="relative z-20 flex flex-col items-center w-full">
      <!-- Add adventure log content here -->
    </div>
  </div>
</template>

<script>
import MenuBar from '../components/MenuBar.vue';
import QuestItem from '../components/QuestItem.vue';
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted } from 'vue';
import { getActiveQuests, getCompletedQuests, getQuestById } from '../data/quests.js';

export default {
  name: 'AdventureLog',
  components: { MenuBar, QuestItem },
  setup() {
    const router = useRouter();
    function goToRecipes() {
      router.push({ name: 'Home' });
    }
    return { goToRecipes };
  },
  data() {
    return {
      activeQuests: [],
      completedQuests: [],
      selectedQuest: null,
      displayedLines: [],
      currentLine: 0,
      currentChar: 0,
      typingInterval: null,
      questWithMarker: null, // Track which quest has the marker
      hoveredQuestId: null, // Track which quest is being hovered
    };
  },
  computed: {
    allQuests() {
      // Return active quests first, then completed quests
      return [...this.activeQuests, ...this.completedQuests];
    },
  },
  mounted() {
    this.loadQuests();
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeDestroy() {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
    document.removeEventListener('keydown', this.handleKeydown);
  },
  methods: {
    handleKeydown(event) {
      if (event.key === 'r' || event.key === 'R' || 
        event.key === 'ArrowRight'
      ) {
        this.goToRecipes();
      } else if (event.key === 'ArrowDown') {
        this.navigateToNextQuest();
      } else if (event.key === 'ArrowUp') {
        this.navigateToPreviousQuest();
      }
    },
    loadQuests() {
      this.activeQuests = getActiveQuests();
      this.completedQuests = getCompletedQuests();
      // Select the first active quest by default if available
      if (this.activeQuests.length > 0) {
        this.selectedQuest = this.activeQuests[0];
        this.questWithMarker = this.activeQuests[0].id; // Set first active quest as having marker
        this.startTyping();
      } else if (this.completedQuests.length > 0) {
        // If no active quests, select the first completed quest (but no marker)
        this.selectedQuest = this.completedQuests[0];
        this.startTyping();
      }
    },
    onQuestClick(questId) {
      this.selectedQuest = getQuestById(questId);
      // Only set marker if the quest is active
      if (this.selectedQuest && this.selectedQuest.state === 'active') {
        this.questWithMarker = questId;
      }
      this.startTyping();
    },
    navigateToNextQuest() {
      if (this.allQuests.length === 0) return;
      
      const currentIndex = this.allQuests.findIndex(quest => quest.id === this.selectedQuest?.id);
      const nextIndex = (currentIndex + 1) % this.allQuests.length;
      const nextQuest = this.allQuests[nextIndex];
      
      this.selectedQuest = nextQuest;
      // Only set marker if the quest is active
      if (nextQuest.state === 'active') {
        this.questWithMarker = nextQuest.id;
      }
      this.startTyping();
    },
    navigateToPreviousQuest() {
      if (this.allQuests.length === 0) return;
      
      const currentIndex = this.allQuests.findIndex(quest => quest.id === this.selectedQuest?.id);
      const prevIndex = currentIndex === 0 ? this.allQuests.length - 1 : currentIndex - 1;
      const prevQuest = this.allQuests[prevIndex];
      
      this.selectedQuest = prevQuest;
      // Only set marker if the quest is active
      if (prevQuest.state === 'active') {
        this.questWithMarker = prevQuest.id;
      }
      this.startTyping();
    },
    onQuestHover(questId) {
      this.hoveredQuestId = questId;
    },
    onQuestLeave() {
      this.hoveredQuestId = null;
    },
    startTyping() {
      // Clear any existing typing interval
      if (this.typingInterval) {
        clearInterval(this.typingInterval);
      }
      
      if (!this.selectedQuest) return;
      const descriptionLines = this.selectedQuest.description;
      this.displayedLines = new Array(descriptionLines.length).fill('');
      this.currentLine = 0;
      this.currentChar = 0;
      
      this.typingInterval = setInterval(this.typeNextChar, 19); // Adjust speed here
    },
    typeNextChar() {
      if (!this.selectedQuest) return;
      
      const descriptionLines = this.selectedQuest.description;
      
      if (this.currentLine < descriptionLines.length) {
        const fullLine = descriptionLines[this.currentLine];
        if (this.currentChar < fullLine.length) {
          this.displayedLines.splice(
            this.currentLine,
            1,
            fullLine.slice(0, this.currentChar + 1)
          );
          this.currentChar++;
        } else {
          // Move to next paragraph
          this.currentLine++;
          this.currentChar = 0;
        }
      } else {
        clearInterval(this.typingInterval);
      }
    },
    },
}
</script>

<style scoped>
.overlay-blur {
  background: rgba(0, 0, 0, 0.30);
  backdrop-filter: blur(5px);
}
.sword-overlay {
  position: absolute;
  right: 0;
  bottom: -70px; 
  width: 390px;
  max-width: 50vw;
  z-index: 15;
  pointer-events: none;
  user-select: none;
  opacity: 60%;
}
.al-content-wrapper {
  position: absolute;
  right: 0;
  bottom: 100px;
  width: 540px;
  max-width: 60vw;
  height: auto; 
  z-index: 16;
}
.main-quest-wrapper {
  position: absolute;
  left: 60px;
  top: 110px;
  width: 540px;
  max-width: 60vw;
  height: auto; 
  z-index: 16;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.main-quest-items {
  margin-top: 2.5em;
  margin-left: 1em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}
.al-content-overlay {
  width: 100%;
  height: auto;
  display: block;
  pointer-events: none;
  user-select: none;
}
.main-quest-header {
  position: absolute;
  top: 4%;  
  left: 4%;   
  width: 60%;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.al-header {
  position: absolute;
  top: 4%;  
  left: 4%;   
  width: 60%;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.al-title {
  font-size: 1.7vw;
  font-weight: bold;
  font-style: italic;
  color: #fff;
  letter-spacing: 0.5px;
  margin-bottom: 0.05em;
}
.main-quest-title {
  font-size: 1.6vw;
  font-weight: 500;
  font-style: italic;
  color: #fff;
  letter-spacing: 0.5px;
  margin-bottom: 0.05em;
}
.al-underline {
  width: 100%;
  height: 0.09em;
  background: #fff;
  border-radius: 2px;
  margin-bottom: 0.1em;
  opacity: 30%;
}
.al-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 0;
}
.al-requestor {
  display: flex;
  align-items: center;
  margin-top: 0;
}
.notification-icon {
  height: 1.3em; 
  width: auto;
  margin-right: 0.5em;
  display: inline-block;
}
.requestor-name {
  color: #AAA79F;
  font-weight: 500;
  font-size: 1.4vw; 
  line-height: 1.0em; 
  display: inline-block;
  font-style: italic;
}
.al-location {
  color: #E1C139;
  font-weight: 700;
  font-size: 1.4vw;
  font-style: italic;
  text-align: right;
  margin: 0;
}
.al-description {
  margin-top: 1.2em;
  color: #fff;
  font-size: 1.2vw;
  font-family: inherit;
  width: 100%;
  min-height: 7em;
  white-space: pre-line;
  line-height: 1.5;
  font-weight: 600;
}
.al-description :deep(.al-highlight) {
  color: #F15050;
}
</style>