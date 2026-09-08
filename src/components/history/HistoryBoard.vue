<script setup lang="ts">
import type { MatchRecord } from '@/domain/types'
import KmGauge from './KmGauge.vue'
import MatchCard from './MatchCard.vue'
import './HistoryBoard.scss'

defineProps<{
  matches: MatchRecord[]
  totalKm: number
}>()

defineEmits<{
  clear: []
}>()
</script>

<template>
  <aside class="history-board">
    <h2 class="history-board__title">HISTORIQUE</h2>

    <KmGauge :total-km="totalKm" />

    <p v-if="!matches.length" class="history-board__empty">
      AUCUN MATCH — PREMIER SET !
    </p>

    <ul v-else class="history-board__list">
      <li v-for="match in matches" :key="match.id">
        <MatchCard :match="match" />
      </li>
    </ul>

    <button
      v-if="matches.length"
      type="button"
      class="history-board__clear"
      @click="$emit('clear')"
    >
      EFFACER L'HISTORIQUE
    </button>
  </aside>
</template>
