<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import './HowItWorks.scss'

const emit = defineEmits<{
  close: []
}>()

const closeRef = ref<HTMLButtonElement | null>(null)

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
</script>

<template>
  <div class="how-it-works" role="dialog" aria-modal="true" aria-label="Comment ça marche">
    <div class="how-it-works__sheet">
      <header class="how-it-works__head">
        <h2>COMMENT ÇA MARCHE</h2>
        <button ref="closeRef" type="button" class="how-it-works__close" @click="emit('close')">
          FERMER
        </button>
      </header>

      <ol class="how-it-works__steps">
        <li>
          <strong>1. JOUE</strong>
          <p>Match BO5 (ou BO3 via Options). Saisie après le match, pas en live.</p>
        </li>
        <li>
          <strong>2. BALANCE LES SCORES</strong>
          <p>Set gagné à 21 (ou 11). Écart minimum de 2. Le match s’arrête dès qu’un joueur a assez de sets.</p>
        </li>
        <li>
          <strong>3. RÉVÉLATION</strong>
          <p>L’app calcule ta « peine » en km. Plus tu perds, plus tu cours. Victoire = frein.</p>
        </li>
        <li>
          <strong>4. HISTORIQUE</strong>
          <p>Chaque match s’accumule. Cumul, bilan V/D, moyenne et pire peine.</p>
        </li>
      </ol>

      <div class="how-it-works__block">
        <h3>CE QUI FAIT GONFLER LES KM</h3>
        <ul>
          <li>Écart large perdu → plus de peine</li>
          <li>Bulle subie (&lt; moitié des points) → surcoût</li>
          <li>Deuce long → km en plus</li>
          <li>Pression qui monte à chaque set</li>
        </ul>
      </div>

      <div class="how-it-works__block how-it-works__block--accent">
        <h3>MULTIPLICATEURS</h3>
        <ul>
          <li>🔥 REMONTADA — ×0.5 (tu reviens de loin)</li>
          <li>DOMINATION — ×0.7 (victoire nette)</li>
          <li>SWEEP SUBI — ×1.3 (défaite sèche)</li>
          <li>💀 CHOKE — ×1.5 (tu menais, tu perds)</li>
        </ul>
      </div>
    </div>
  </div>
</template>
