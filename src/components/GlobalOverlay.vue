<template>
  <div class="global-overlay"></div>
</template>

<script>
export default {
  name: 'GlobalOverlay'
}
</script>

<style scoped>
.global-overlay {
  position: fixed;
  inset: 0;
  z-index: -1; /* Send to the background */
  /* background: linear-gradient(
    45deg,
    rgba(0, 191, 255, 0.02) 0%,
    rgba(0, 191, 255, 0.08) 20%,
    rgba(0, 191, 255, 0.25) 40%,
    rgba(0, 191, 255, 0.08) 60%,
    rgba(0, 191, 255, 0) 80%,
    rgba(0, 191, 255, 0.02) 100%
  );
  background-size: 400% 400%;
  animation: move-gradient 60s ease-in infinite; */
}

/* @keyframes move-gradient {
  0% {
    background-position: 15% 25%;
  }
  15% {
    background-position: 85% 15%;
  }
  30% {
    background-position: 25% 85%;
  }
  45% {
    background-position: 75% 75%;
  }
  60% {
    background-position: 45% 35%;
  }
  75% {
    background-position: 95% 55%;
  }
  90% {
    background-position: 5% 65%;
  }
  100% {
    background-position: 15% 25%;
  }
} */
</style>

