import { ref } from 'vue';

/**
 * A Vue composable for managing a 5-star heart rating system
 * with half-heart support.
 * @param {number} initialValue - The initial rating value.
 * @returns {object} - Reactive properties and methods for the rating system.
 */
export function useHeartRating(initialValue = 0) {
  const hearts = ref(initialValue);

  // Use the same logic as in the components
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const basePath = isLocal ? '' : '/sheikah-plate';

  /**
   * Determines the correct heart image source based on the rating.
   * @param {number} n - The heart number (1-5).
   * @returns {string} - The path to the heart image.
   */
  const getHeartSrc = (n) => {
    if (hearts.value >= n) {
      return `${basePath}/assets/ui-assets/full-heart.png`;
    }
    if (hearts.value >= n - 0.5) {
      return `${basePath}/assets/ui-assets/half-heart.png`;
    }
    return `${basePath}/assets/ui-assets/empty-heart.png`;
  };

  /**
   * Sets the rating based on a click event on a heart.
   * Supports half-heart ratings by checking click position.
   * @param {number} n - The heart number (1-5).
   * @param {MouseEvent} event - The click event.
   */
  const setRating = (n, event) => {
    const isLeftHalf = event.offsetX < event.target.offsetWidth / 2;
    const newRating = n - (isLeftHalf ? 0.5 : 0);

    // If clicking the same spot, clear the rating for that heart.
    // Otherwise, set the new rating.
    if (hearts.value === newRating) {
      hearts.value = n - 1;
    } else {
      hearts.value = newRating;
    }
  };

  return {
    hearts,
    getHeartSrc,
    setRating,
  };
} 