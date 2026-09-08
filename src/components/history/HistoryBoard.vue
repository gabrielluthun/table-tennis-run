<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { summarizeMatches } from '@/domain/matchStats'
import type { MatchRecord } from '@/domain/types'
import KmTotal from './KmTotal.vue'
import MatchCard from './MatchCard.vue'
import MatchStats from './MatchStats.vue'
import './HistoryBoard.scss'

const props = defineProps<{
  matches: MatchRecord[]
  totalKm: number
  confirmMatchDelete?: boolean
}>()

const emit = defineEmits<{
  clear: []
  remove: [id: string]
}>()

const pendingClear = ref(false)
const pendingRemoveId = ref<string | null>(null)

watch(
  () => props.matches.length,
  () => {
    pendingClear.value = false
    pendingRemoveId.value = null
  },
)

const stats = computed(() => summarizeMatches(props.matches))

function requestRemove(id: string): void {
  if (props.confirmMatchDelete) pendingRemoveId.value = id
  else emit('remove', id)
}

function confirmRemove(): void {
  if (!pendingRemoveId.value) return
  emit('remove', pendingRemoveId.value)
  pendingRemoveId.value = null
}

function confirmClear(): void {
  pendingClear.value = false
  emit('clear')
}
</script>

<template>
  <aside class="history-board">
    <h2 class="history-board__title">HISTORIQUE</h2>

    <KmTotal :total-km="totalKm" />
    <MatchStats v-if="stats.played" :stats="stats" />

    <p v-if="!matches.length" class="history-board__empty">AUCUN MATCH — PREMIER SET !</p>

    <ul v-else class="history-board__list">
      <li v-for="match in matches" :key="match.id">
        <MatchCard :match="match" @remove="requestRemove" />
      </li>
    </ul>

    <div
      v-if="pendingRemoveId"
      class="history-board__confirm"
      role="group"
      aria-label="Confirmer la suppression"
    >
      <p class="history-board__warn">IRRÉVERSIBLE — CE MATCH</p>
      <button type="button" class="history-board__clear" @click="confirmRemove">OUI, SUPPRIMER</button>
      <button type="button" class="history-board__cancel" @click="pendingRemoveId = null">ANNULER</button>
    </div>

    <button
      v-if="matches.length && !pendingClear && !pendingRemoveId"
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
