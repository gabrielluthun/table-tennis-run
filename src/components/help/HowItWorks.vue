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

        <p class="how-it-works__pitch">
          Tu joues au ping-pong. Tu perds (ou tu gagnes). Et ensuite… tu cours. Plus le match a été
          cruel, plus tu cours. Tout reste sur ton navigateur.
        </p>

        <ol class="how-it-works__steps">
          <li>
            <strong>1. AVANT LE MATCH</strong>
            <p>
              Ouvre Options si tu veux : ton nom, celui de l’adversaire, BO3 ou BO5, sets à 11 ou 21,
              son arcade, mode pitié…
            </p>
          </li>
          <li>
            <strong>2. SUR LA TABLE</strong>
            <p>Tu joues ton match pour de vrai. L’app ne suit pas le score en live.</p>
          </li>
          <li>
            <strong>3. APRÈS LE MATCH</strong>
            <p>Tu saisis les scores set par set. Chaque set est validé avant le suivant.</p>
          </li>
          <li>
            <strong>4. RÉVÉLATION</strong>
            <p>
              L’app te balance ta distance en km, avec des badges (set blanc, choke, remontada…).
            </p>
          </li>
          <li>
            <strong>5. HISTORIQUE</strong>
            <p>
              Cumul, bilan V/D, moyenne, pire peine. Export / import JSON depuis Options.
            </p>
          </li>
        </ol>

        <div class="how-it-works__block">
          <h3>CE QUE CHAQUE SET AJOUTE</h3>
          <p class="how-it-works__sub">ÇA FAIT MONTER LA PEINE</p>
          <ul>
            <li>Tu perds le set = base kilométrique déjà lourde</li>
            <li>Gros écart contre toi = ça grimpe</li>
            <li>Set blanc = énorme surcoût</li>
            <li>Deuce = km en plus</li>
            <li>Sets tardifs = un set blanc pèse encore plus</li>
          </ul>
          <p class="how-it-works__sub">ÇA FREINE LA PEINE</p>
          <ul>
            <li>Tu gagnes le set = base kilométrique légère</li>
            <li>Set blanc infligé = la peine de ce set baisse</li>
          </ul>
        </div>

        <div class="how-it-works__block how-it-works__block--accent">
          <h3>LES 4 MULTIPLICATEURS</h3>
          <p class="how-it-works__note">
            Le total des sets est toujours multiplié par un de ces facteurs.
          </p>
          <ul>
            <li>🔥 REMONTADA — ×0.5 : tu gagnes après avoir perdu le début (1er set BO3 / 2 premiers BO5)</li>
            <li>DOMINATION — ×0.7 : tu gagnes sans remontada</li>
            <li>SWEEP SUBI — ×1.3 : tu perds sans avoir mené au début</li>
            <li>💀 CHOKE — ×1.5 : tu perds après avoir mené au début (1er set BO3 / 2 premiers BO5)</li>
          </ul>
          <p class="how-it-works__note">Victoire = ×0.5 ou ×0.7 · Défaite = ×1.3 ou ×1.5</p>
        </div>

        <div class="how-it-works__block how-it-works__block--badges">
          <h3>BADGES</h3>
          <ul>
            <li>SET BLANC INFLIGÉ / SUBI — sur un set</li>
            <li>PROLONGATION DEUCE — set qui s’éternise</li>
            <li>REMONTADA ×0.5 · DOMINATION ×0.7 · SWEEP SUBI ×1.3 · CHOKE ×1.5</li>
          </ul>
        </div>
      </div>
    </div>
  </Teleport>
</template>
