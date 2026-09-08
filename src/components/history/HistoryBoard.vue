<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MatchRecord } from '@/domain/types'
import KmTotal from './KmTotal.vue'
import MatchCard from './MatchCard.vue'
import './HistoryBoard.scss'

const props = defineProps<{
  matches: MatchRecord[]
  totalKm: number
}>()

const emit = defineEmits<{
  clear: []
  remove: [id: string]
}>()

const pendingClear = ref(false)

watch(
  () => props.matches.length,
  () => {
    pendingClear.value = false
  },
)

function confirmClear(): void {
  pendingClear.value = false
  emit('clear')
}
</script>

<template>
  <aside class="history-board">
    <h2 class="history-board__title">HISTORIQUE</h2>

    <KmTotal :total-km="totalKm" />

    <p v-if="!matches.length" class="history-board__empty">AUCUN MATCH — PREMIER SET !</p>

    <ul v-else class="history-board__list">
      <li v-for="match in matches" :key="match.id">
        <MatchCard :match="match" @remove="emit('remove', $event)" />
      </li>
    </ul>

    <button
      v-if="matches.length && !pendingClear"
      type="button"
      class="history-board__clear"
      @click="pendingClear = true"
    >
      EFFACER L'HISTORIQUE
    </button>

    <div v-if="pendingClear" class="history-board__confirm" role="group" aria-label="Confirmer l'effacement">
      <p class="history-board__warn">IRRÉVERSIBLE — TOUS LES MATCHS</p>
      <button type="button" class="history-board__clear" @click="confirmClear">OUI, TOUT EFFACER</button>
      <button type="button" class="history-board__cancel" @click="pendingClear = false">ANNULER</button>
    </div>
  </aside>
</template>
