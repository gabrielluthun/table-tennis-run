<script setup lang="ts">
import { computed } from 'vue'
import type { MatchRecord } from '@/domain/types'

const props = defineProps<{
  match: MatchRecord
}>()

const formattedDate = computed(() =>
  new Date(props.match.date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }),
)

const scoreLine = computed(() =>
  props.match.sets.map((s) => `${s.user}-${s.adversaire}`).join(' / '),
)
</script>

<template>
  <article class="match-card">
    <div class="match-card__top">
      <time :datetime="match.date">{{ formattedDate }}</time>
      <span class="match-card__km">{{ match.distance }} km</span>
    </div>
    <p class="match-card__score">{{ scoreLine }}</p>
    <p class="match-card__sequence">{{ match.sequence.join(' ') }}</p>
    <div v-if="match.badges.length" class="match-card__badges">
      <span v-for="badge in match.badges.slice(0, 3)" :key="badge.id" class="match-card__badge">
        {{ badge.label }}
      </span>
      <span v-if="match.badges.length > 3" class="match-card__badge">
        +{{ match.badges.length - 3 }}
      </span>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/neo-brutalism' as *;

.match-card {
  @include neo-card($bg-white);
  padding: 0.75rem;

  &__top {
    align-items: center;
    display: flex;
    font-size: 0.7rem;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  &__km {
    background: $bg-black;
    color: $bg-acid-green;
    font-family: $font-score;
    font-size: 0.55rem;
    padding: 0.25rem 0.5rem;
  }

  &__score {
    font-family: $font-score;
    font-size: 0.55rem;
    margin-bottom: 0.25rem;
  }

  &__sequence {
    font-size: 0.65rem;
    margin-bottom: 0.5rem;
    opacity: 0.7;
  }

  &__badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  &__badge {
    background: $bg-cyan;
    border: 2px solid $bg-black;
    font-size: 0.5rem;
    padding: 0.15rem 0.35rem;
  }
}
</style>
