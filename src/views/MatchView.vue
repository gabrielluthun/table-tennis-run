<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePingPongTracker } from '@/composables/usePingPongTracker'
import { useSettings } from '@/composables/useSettings'
import ScoreInput from '@/components/score-input/ScoreInput.vue'
import RevealScreen from '@/components/reveal/RevealScreen.vue'
import HistoryBoard from '@/components/history/HistoryBoard.vue'
import OptionsPanel from '@/components/options/OptionsPanel.vue'
import HowItWorks from '@/components/help/HowItWorks.vue'
import { downloadMatches, parseImportedMatches } from '@/services/matchExport'
import type { SetInput } from '@/domain/types'
import '@/App.scss'

const route = useRoute()
const router = useRouter()

const scoreInputRef = ref<InstanceType<typeof ScoreInput> | null>(null)
const optionsError = ref('')

const { settings, rules, patch, reset } = useSettings()

const {
  matches,
  totalKm,
  currentStep,
  lastResult,
  formErrors,
  submitMatch,
  resetToInput,
  deleteMatch,
  replaceMatches,
  clearHistory,
} = usePingPongTracker()

const showSettings = computed(() => route.name === 'settings')
const showHelp = computed(() => route.name === 'help')
const showHelpButton = computed(
  () => route.name === 'home' && currentStep.value !== 'reveal',
)

function goHome(): void {
  if (route.name !== 'home') router.push({ name: 'home' })
}

function handleSubmit(sets: SetInput[]): void {
  submitMatch(sets, rules.value, settings.value.pityMode)
}

function handleCloseReveal(): void {
  resetToInput()
  scoreInputRef.value?.resetForm()
}

async function handleImport(file: File): Promise<void> {
  try {
    const next = parseImportedMatches(await file.text())
    replaceMatches(next)
    optionsError.value = ''
    goHome()
  } catch {
    optionsError.value = 'Import impossible : JSON invalide.'
  }
}

function handleReset(): void {
  reset()
  optionsError.value = ''
}
</script>

<template>
  <div class="app">
    <header class="app__header">
      <button type="button" class="app__options" @click="router.push({ name: 'settings' })">
        OPTIONS
      </button>
      <div class="app__brand">
        <h1 class="app__title">TABLE TENNIS RUN</h1>
        <p class="app__subtitle">Ping-Pong → Kilomètres</p>
      </div>
    </header>

    <main class="app__main">
      <ScoreInput
        v-if="currentStep === 'input'"
        :key="`${settings.format}-${settings.setTarget}`"
        ref="scoreInputRef"
        :errors="formErrors"
        :rules="rules"
        :player-name="settings.playerName"
        :opponent-name="settings.opponentName"
        @submit="handleSubmit"
      />
      <RevealScreen
        v-if="currentStep === 'reveal' && lastResult"
        :result="lastResult"
        :sound-enabled="settings.soundEnabled"
        @close="handleCloseReveal"
      />
    </main>

    <HistoryBoard
      :matches="matches"
      :total-km="totalKm"
      @clear="clearHistory"
      @remove="deleteMatch"
    />

    <button
      v-if="showHelpButton"
      type="button"
      class="app__help"
      @click="router.push({ name: 'help' })"
    >
      COMMENT ÇA MARCHE
    </button>

    <HowItWorks v-if="showHelp" @close="goHome" />

    <OptionsPanel
      v-if="showSettings"
      :settings="settings"
      :match-count="matches.length"
      :error="optionsError"
      @close="goHome"
      @patch="patch"
      @reset="handleReset"
      @export="downloadMatches(matches)"
      @import="handleImport"
    />
  </div>
</template>
