<template>
  <div id="app" class="w-full h-screen">
    <GlobalOverlay />
    <router-view />
  </div>
</template>

<script>
import GlobalOverlay from './components/GlobalOverlay.vue';

export default {
  name: 'App',
  components: {
    GlobalOverlay
  }
}
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  padding: 0;
}

.al-content-wrapper {
  position: absolute;
  right: 0;
  bottom: 100px;
  width: 60vw;
  max-width: 900px;
  min-width: 590px;
  height: auto;
  z-index: 16;
}

.al-content-overlay {
  width: 100%;
  height: auto;
  display: block;
  pointer-events: none;
  user-select: none;
}
</style>
