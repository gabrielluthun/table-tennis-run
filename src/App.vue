<script setup lang="ts">
import { ref } from 'vue'
import { usePingPongTracker } from '@/composables/usePingPongTracker'
import ScoreInput from '@/components/score-input/ScoreInput.vue'
import RevealScreen from '@/components/reveal/RevealScreen.vue'
import HistoryBoard from '@/components/history/HistoryBoard.vue'
import type { SetInput } from '@/domain/types'
import './App.scss'

const scoreInputRef = ref<InstanceType<typeof ScoreInput> | null>(null)

const {
  matches,
  totalKm,
  currentStep,
  lastResult,
  formErrors,
  submitMatch,
  resetToInput,
  deleteMatch,
  clearHistory,
} = usePingPongTracker()

function handleSubmit(sets: SetInput[]): void {
  submitMatch(sets)
}

function handleCloseReveal(): void {
  resetToInput()
  scoreInputRef.value?.resetForm()
}
</script>

<template>
  <div class="app">
    <header class="app__header">
      <h1 class="app__title">TABLE TENNIS RUN</h1>
      <p class="app__subtitle">Ping-Pong → Kilomètres</p>
    </header>

    <main class="app__main">
      <ScoreInput
        v-if="currentStep === 'input'"
        ref="scoreInputRef"
        :errors="formErrors"
        @submit="handleSubmit"
      />
      <RevealScreen
        v-if="currentStep === 'reveal' && lastResult"
        :result="lastResult"
        @close="handleCloseReveal"
      />
    </main>

    <HistoryBoard
      :matches="matches"
      :total-km="totalKm"
      @clear="clearHistory"
      @remove="deleteMatch"
    />
  </div>
</template>
