<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { MatchRecord } from '@/domain/types'
import SpecialBadge from './SpecialBadge.vue'
import './RevealScreen.scss'

const props = defineProps<{
  result: MatchRecord
}>()

const emit = defineEmits<{
  close: []
}>()

const phase = ref<'calc' | 'reveal'>('calc')
const visibleBadges = ref(0)

const sequenceLabel = computed(() => props.result.sequence.join(' / '))

onMounted(() => {
  setTimeout(() => {
    phase.value = 'reveal'
    revealBadges()
  }, 1200)
})

function revealBadges(): void {
  const total = props.result.badges.length
  if (total === 0) return

  const interval = setInterval(() => {
    visibleBadges.value += 1
    if (visibleBadges.value >= total) clearInterval(interval)
  }, 400)
}
</script>

<template>
  <div class="reveal-screen" role="dialog" aria-live="assertive" aria-label="Résultat kilométrique">
    <p v-if="phase === 'calc'" class="reveal-screen__calc">CALCUL...</p>

    <template v-else>
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
    </template>

    <button
      v-if="phase === 'reveal'"
      type="button"
      class="reveal-screen__close"
      @click="emit('close')"
    >
      NOUVEAU MATCH
    </button>
  </div>
</template>
