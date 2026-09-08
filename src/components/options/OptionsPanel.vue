<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { AppSettings } from '@/domain/settings'
import type { MatchFormat, SetTarget } from '@/domain/types'
import './OptionsPanel.scss'

defineProps<{
  settings: AppSettings
  matchCount: number
  error?: string
}>()

const emit = defineEmits<{
  close: []
  patch: [partial: Partial<AppSettings>]
  reset: []
  export: []
  import: [file: File]
}>()

const closeRef = ref<HTMLButtonElement | null>(null)
const fileRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  window.addEventListener('keydown', onKey)
  closeRef.value?.focus()
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
})

function onKey(event: KeyboardEvent): void {
  if (event.key === 'Escape') emit('close')
}

function setFormat(format: MatchFormat): void {
  emit('patch', { format })
}

function setTarget(setTarget: SetTarget): void {
  emit('patch', { setTarget })
}

function onFile(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) emit('import', file)
  if (fileRef.value) fileRef.value.value = ''
}
</script>

<template>
  <div class="options-panel" role="dialog" aria-modal="true" aria-label="Options">
    <div class="options-panel__sheet">
      <header class="options-panel__head">
        <h2>OPTIONS</h2>
        <button ref="closeRef" type="button" class="options-panel__close" @click="emit('close')">
          FERMER
        </button>
      </header>

      <label class="options-panel__field">
        TON NOM
        <input
          type="text"
          maxlength="15"
          :value="settings.playerName"
          @input="emit('patch', { playerName: ($event.target as HTMLInputElement).value })"
        />
      </label>
      <label class="options-panel__field">
        NOM DE TON ADVERSAIRE
        <input
          type="text"
          maxlength="15"
          :value="settings.opponentName"
          @input="emit('patch', { opponentName: ($event.target as HTMLInputElement).value })"
        />
      </label>

      <p class="options-panel__label">FORMAT</p>
      <div class="options-panel__toggles">
        <button type="button" :class="{ 'is-on': settings.format === 'BO3' }" @click="setFormat('BO3')">
          BO3
        </button>
        <button type="button" :class="{ 'is-on': settings.format === 'BO5' }" @click="setFormat('BO5')">
          BO5
        </button>
      </div>

      <p class="options-panel__label">SET GAGNANT</p>
      <div class="options-panel__toggles">
        <button type="button" :class="{ 'is-on': settings.setTarget === 11 }" @click="setTarget(11)">
          11 PTS
        </button>
        <button type="button" :class="{ 'is-on': settings.setTarget === 21 }" @click="setTarget(21)">
          21 PTS
        </button>
      </div>

      <label class="options-panel__check">
        <input
          type="checkbox"
          :checked="settings.soundEnabled"
          @change="emit('patch', { soundEnabled: ($event.target as HTMLInputElement).checked })"
        />
        SON ARCADE À LA RÉVÉLATION
      </label>
      <label class="options-panel__check">
        <input
          type="checkbox"
          :checked="settings.confirmMatchDelete"
          @change="emit('patch', { confirmMatchDelete: ($event.target as HTMLInputElement).checked })"
        />
        CONFIRMER LA SUPPRESSION D'UN MATCH
      </label>

      <div class="options-panel__data">
        <button type="button" class="options-panel__ghost" :disabled="!matchCount" @click="emit('export')">
          EXPORTER L'HISTORIQUE
        </button>
        <button type="button" class="options-panel__ghost" @click="fileRef?.click()">
          IMPORTER (REMPLACE TOUT)
        </button>
        <input ref="fileRef" class="sr-only" type="file" accept="application/json" @change="onFile" />
      </div>

      <p v-if="error" class="options-panel__error">{{ error }}</p>

      <button type="button" class="options-panel__reset" @click="emit('reset')">RÉGLAGES PAR DÉFAUT</button>
    </div>
  </div>
</template>
