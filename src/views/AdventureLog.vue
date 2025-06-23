<template>
  <div class="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 w-full h-full z-0">
      <img src="/assets/ui-assets/adventure-log-bg.png" alt="Adventure Log Background" class="w-full h-full object-cover" draggable="false" />
    </div>
    <div class="absolute inset-0 w-full h-full z-10 overlay-blur"></div>
    <img src="/assets/ui-assets/sword-overlay.png" alt="Sword Overlay" class="sword-overlay" draggable="false" />
    <div class="al-content-wrapper">
      <img src="/assets/ui-assets/adventure-log-content.png" alt="Adventure Log Content" class="al-content-overlay" draggable="false" />
      <div class="al-header">
        <span class="al-title">Add a new recipe</span>
        <div class="al-underline"></div>
        <div class="al-row">
          <div class="al-requestor">
            <img src="/assets/ui-assets/notification.png" alt="Notification" class="notification-icon" />
            <span class="requestor-name">Zelda</span>
          </div>
          <div class="al-location">Hateno Village</div>
        </div>
        <div class="al-description">
          <div v-for="(line, idx) in displayedLines" :key="idx" v-html="line"></div>
        </div>
      </div>
    </div>
    <MenuBar class="absolute top-0 left-0 w-full z-30" />
    <div class="relative z-20 flex flex-col items-center w-full">
      <!-- Add adventure log content here -->
    </div>
  </div>
</template>

<script>
import MenuBar from '../components/MenuBar.vue';

export default {
  name: 'AdventureLog',
  components: { MenuBar },
  data() {
    return {
      descriptionLines: [
        'After saving Hyrule from Calamity Ganon, Zelda moves in with you. Upon visiting the Hateno Ancient Tech Lab, Purah updates your Sheikah Slate so that you can store <span class="al-highlight">recipes.</span>',
        "\n",
        "Since you have less off your plate, Zelda asks you to share your favorite meals with her.",
        "\n",
        "Purah's words echo in your memory. To access your recipes use the right arrow key or press r..."
      ],
      displayedLines: ["", "", ""],
      currentLine: 0,
      currentChar: 0,
      typingInterval: null,
    };
  },
  mounted() {
    this.startTyping();
  },
  methods: {
    startTyping() {
      this.typingInterval = setInterval(this.typeNextChar, 19); // Adjust speed here
    },
    typeNextChar() {
      if (this.currentLine < this.descriptionLines.length) {
        const fullLine = this.descriptionLines[this.currentLine];
        if (this.currentChar < fullLine.length) {
          this.displayedLines.splice(
            this.currentLine,
            1,
            fullLine.slice(0, this.currentChar + 1)
          );
          this.currentChar++;
        } else {
          this.currentLine++;
          this.currentChar = 0;
        }
      } else {
        clearInterval(this.typingInterval);
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.typingInterval);
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
  bottom: -70px; /* Move the sword down so part of it is hidden */
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
  height: auto; /* or set a fixed height if needed */
  z-index: 16;
}
.al-content-overlay {
  width: 100%;
  height: auto;
  display: block;
  pointer-events: none;
  user-select: none;
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
  margin-bottom: 0.05em; /* less space below the title */
}
.al-underline {
  width: 100%;
  height: 0.04em;
  background: #fff;
  border-radius: 2px;
  margin-bottom: 0.1em;
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
  height: 1.3em; /* Adjust as needed to match your design */
  width: auto;
  margin-right: 0.5em;
  display: inline-block;
}
.requestor-name {
  color: #AAA79F;
  font-weight: 500;
  font-size: 1.4vw; /* Smaller than the title, scales with viewport */
  line-height: 1.0em; /* Match the icon height */
  display: inline-block;
  font-style: italic;
}
.al-location {
  color: #E1C139;
  font-weight: bold;
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