<script setup lang="ts">
import type { MatchStats } from '@/domain/types'

defineProps<{
  stats: MatchStats
}>()
</script>

<template>
  <ul class="match-stats" aria-label="Statistiques des matchs">
    <li class="match-stats__item">
      <span class="match-stats__label">BILAN</span>
      <span class="match-stats__value">{{ stats.wins }}V {{ stats.losses }}D</span>
    </li>
    <li class="match-stats__item">
      <span class="match-stats__label">MOYEN</span>
      <span class="match-stats__value">{{ stats.averageKm }} km</span>
    </li>
    <li class="match-stats__item match-stats__item--worst">
      <span class="match-stats__label">PIRE PEINE</span>
      <span class="match-stats__value">{{ stats.worstKm }} km</span>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/neo-brutalism' as *;

.match-stats {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(3, 1fr);
  list-style: none;

  &__item {
    @include neo-card($bg-cyan);
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 0.5rem 0.35rem;
    text-align: center;

    &--worst {
      background: $bg-fluo-pink;
      color: $bg-white;
    }
  }

  &__label {
    font-size: 0.55rem;
    line-height: 1.2;
  }

  &__value {
    font-family: $font-score;
    font-size: 0.5rem;
    line-height: 1.4;
  }
}
</style>
