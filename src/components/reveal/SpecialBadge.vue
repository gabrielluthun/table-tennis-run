<script setup lang="ts">
import type { Badge } from '@/domain/types'

defineProps<{
  badge: Badge
}>()
</script>

<template>
  <span class="special-badge">{{ badge.label }}</span>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.special-badge {
  animation: blink-border 0.8s step-end infinite, badge-slide 0.4s ease-out;
  background: $bg-white;
  border: $border-thick;
  display: inline-block;
  font-family: $font-score;
  font-size: 0.55rem;
  padding: 0.5rem 0.75rem;
}
</style>
