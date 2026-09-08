<script setup lang="ts">
import { computed } from 'vue'
import { getSetWinner, isValidSetScore } from '@/domain/setValidation'
import type { SetInput } from '@/domain/types'
import './SetScoreRow.scss'

const props = defineProps<{
  index: number
  modelValue: SetInput
}>()

defineEmits<{
  'update:modelValue': [value: SetInput]
}>()

const scores = computed(() => {
  const { user, adversaire } = props.modelValue
  if (user === '' || adversaire === '') return null
  const parsed = { user: Number(user), adversaire: Number(adversaire) }
  return Number.isNaN(parsed.user) || Number.isNaN(parsed.adversaire) ? null : parsed
})

const status = computed(() => {
  if (!scores.value) return 'empty'
  return isValidSetScore(scores.value.user, scores.value.adversaire) ? 'valid' : 'invalid'
})

const statusLabel = computed(() => {
  if (!scores.value || status.value === 'invalid') return '✗'
  return getSetWinner(scores.value.user, scores.value.adversaire) === 'user' ? '✓ TOI' : '✓ ADV'
})
</script>

<template>
  <div class="set-row" :class="`set-row--${status}`">
    <div class="set-row__head">
      <span class="set-row__label">SET {{ index }}</span>
      <span v-if="status !== 'empty'" class="set-row__status">{{ statusLabel }}</span>
    </div>
    <div class="set-row__inputs">
      <label>
        <span class="sr-only">Toi set {{ index }}</span>
        <input
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
