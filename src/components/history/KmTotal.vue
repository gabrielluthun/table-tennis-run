<script setup lang="ts">
defineProps<{
  totalKm: number
}>()
</script>

<template>
  <div class="km-total">
    <span class="km-total__label">KILOMÉTRAGE CUMULÉ</span>
    <p class="km-total__value" aria-live="polite">{{ totalKm }} km</p>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/neo-brutalism' as *;

.km-total {
  @include neo-card($bg-mustard);
  padding: 1rem;
  text-align: center;

  &__label {
    display: block;
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
  }

  &__value {
    font-family: $font-score;
    font-size: 1.25rem;
  }
}
</style>
