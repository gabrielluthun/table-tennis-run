<script setup lang="ts">
import type { SetInput } from '@/domain/types'

defineProps<{
  index: number
  modelValue: SetInput
}>()

defineEmits<{
  'update:modelValue': [value: SetInput]
}>()
</script>

<template>
  <div class="set-row">
    <span class="set-row__label">SET {{ index }}</span>
    <div class="set-row__inputs">
      <label>
        <span class="sr-only">Toi set {{ index }}</span>
        <input
          :id="`set-${index}-user`"
          type="number"
          inputmode="numeric"
          min="0"
          :value="modelValue.user"
          placeholder="—"
          @input="
            $emit('update:modelValue', {
              ...modelValue,
              user: ($event.target as HTMLInputElement).value,
            })
          "
        />
      </label>
      <span class="set-row__sep">—</span>
      <label>
        <span class="sr-only">Adversaire set {{ index }}</span>
        <input
          :id="`set-${index}-adv`"
          type="number"
          inputmode="numeric"
          min="0"
          :value="modelValue.adversaire"
          placeholder="—"
          @input="
            $emit('update:modelValue', {
              ...modelValue,
              adversaire: ($event.target as HTMLInputElement).value,
            })
          "
        />
      </label>
    </div>
    <div class="set-row__players">
      <span>TOI</span>
      <span>ADV</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/neo-brutalism' as *;

.set-row {
  @include neo-card($bg-cyan);
  display: grid;
  gap: 0.5rem;
  padding: 1rem;

  &__label {
    font-size: 0.9rem;
  }

  &__inputs {
    align-items: center;
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }

  &__sep {
    font-family: $font-score;
    font-size: 0.65rem;
  }

  input {
    @include neo-input;
  }

  &__players {
    display: flex;
    font-size: 0.65rem;
    justify-content: space-around;
    opacity: 0.7;
  }
}

.sr-only {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}
</style>
