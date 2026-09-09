<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useBodyScrollLock } from '@/composables/useBodyScrollLock'
import './HowItWorks.scss'

const emit = defineEmits<{
  close: []
}>()

const closeRef = ref<HTMLButtonElement | null>(null)

useBodyScrollLock()

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
  <Teleport to="body">
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
            <strong>1. RÉGLAGES PUIS MATCH</strong>
            <p>
              Ouvre Options pour choisir tes noms, le format (BO3 = premier à 2 sets, BO5 = premier à 3)
              et la longueur des sets (11 ou 21 points). Tu joues le match pour de vrai, hors de l’app :
              ici tu ne saisis que le résultat après coup, pas le score en live.
            </p>
          </li>
          <li>
            <strong>2. BALANCE LES SCORES</strong>
            <p>
              Entre les points set par set. Un set est valide quand un joueur atteint le score cible avec
              au moins 2 points d’écart (ex. 11–9 ou 21–19). Dès qu’un joueur a assez de sets pour
              gagner le match, tu t’arrêtes — pas de sets en trop.
            </p>
          </li>
          <li>
            <strong>3. RÉVÉLATION</strong>
            <p>
              L’app transforme ton match en distance de course à pied : c’est ta « peine » en km, avec
              des badges selon le scénario. Plus tu as souffert (défaites, écarts, bulles), plus tu
              cours. Une victoire réduit la facture ; une défaite (surtout un choke) l’alourdit.
            </p>
          </li>
          <li>
            <strong>4. HISTORIQUE</strong>
            <p>
              Chaque match validé s’ajoute à ta liste. Tu y vois le cumul de km, le bilan
              victoires / défaites, ta moyenne et ta pire peine. Tu peux supprimer un match, tout
              effacer, ou exporter / importer l’historique depuis Options.
            </p>
          </li>
        </ol>

        <div class="how-it-works__block how-it-works__block--accent">
          <h3>LES 4 MULTIPLICATEURS</h3>
          <ul>
            <li>🔥 REMONTADA — ×0.5 : tu gagnes après avoir perdu le début (1er set BO3 / 2 premiers BO5)</li>
            <li>DOMINATION — ×0.7 : tu gagnes sans remontada</li>
            <li>SWEEP SUBI — ×1.3 : tu perds sans avoir mené au début</li>
            <li>💀 CHOKE — ×1.5 : tu perds après avoir mené au début (1er set BO3 / 2 premiers BO5)</li>
          </ul>
        </div>

        <div class="how-it-works__block how-it-works__block--badges">
          <h3>BADGES</h3>
          <ul>
            <li>BULLE INFLIGÉE / SUBIE — par set</li>
            <li>PROLONGATION DEUCE — set trop long</li>
            <li>REMONTADA ×0.5 · DOMINATION ×0.7 · SWEEP SUBI ×1.3 · CHOKE ×1.5</li>
          </ul>
        </div>
      </div>
    </div>
  </Teleport>
</template>
