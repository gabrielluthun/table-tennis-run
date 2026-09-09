import { onMounted, onUnmounted } from 'vue'

/** Prevent background scroll while a fullscreen overlay is open. */
export function useBodyScrollLock(): void {
  onMounted(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    onUnmounted(() => {
      document.body.style.overflow = previous
    })
  })
}
