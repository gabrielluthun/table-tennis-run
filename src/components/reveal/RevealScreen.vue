<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import type { MatchRecord } from '@/domain/types'
import SpecialBadge from './SpecialBadge.vue'
import './RevealScreen.scss'

const CALC_DURATION_MS = 1200
const BADGE_INTERVAL_MS = 400

const props = defineProps<{
  result: MatchRecord
}>()

const emit = defineEmits<{
  close: []
}>()

const phase = ref<'calc' | 'reveal'>('calc')
const visibleBadges = ref(0)
const closeRef = ref<HTMLButtonElement | null>(null)

let calcTimer: ReturnType<typeof setTimeout> | undefined
let badgeTimer: ReturnType<typeof setInterval> | undefined

const sequenceLabel = computed(() => props.result.sequence.join(' / '))
const outcomeLabel = computed(() => (props.result.outcome === 'win' ? 'VICTOIRE' : 'DÉFAITE'))

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  calcTimer = setTimeout(reveal, CALC_DURATION_MS)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  clearTimeout(calcTimer)
  clearInterval(badgeTimer)
})

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') emit('close')
}

function reveal(): void {
  phase.value = 'reveal'
  nextTick(() => closeRef.value?.focus())
  revealBadges()
}

function revealBadges(): void {
  const total = props.result.badges.length
  if (total === 0) return

  badgeTimer = setInterval(() => {
    visibleBadges.value += 1
    if (visibleBadges.value >= total) clearInterval(badgeTimer)
  }, BADGE_INTERVAL_MS)
}
</script>

<template>
  <div
    class="reveal-screen"
    :class="`reveal-screen--${result.outcome}`"
    role="dialog"
    aria-modal="true"
    aria-live="assertive"
    aria-label="Résultat kilométrique"
  >
    <p v-if="phase === 'calc'" class="reveal-screen__calc">CALCUL...</p>

    <template v-else>
      <p class="reveal-screen__outcome">{{ outcomeLabel }}</p>
      <p class="reveal-screen__distance">
        {{ result.distance }}
        <span class="reveal-screen__unit">KM</span>
      </p>
      <p class="reveal-screen__sequence">{{ sequenceLabel }}</p>
      <div v-if="result.badges.length" class="reveal-screen__badges">
        <SpecialBadge
          v-for="badge in result.badges.slice(0, visibleBadges)"
          :key="badge.id"
          :badge="badge"
        />
      </div>
      <button ref="closeRef" type="button" class="reveal-screen__close" @click="emit('close')">
        NOUVEAU MATCH
      </button>
    </template>
  </div>
</template>
