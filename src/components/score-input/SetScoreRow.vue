<script setup lang="ts">
import { computed } from 'vue'
import { getSetWinner, isValidSetScore } from '@/domain/setValidation'
import type { SetInput } from '@/domain/types'
import './SetScoreRow.scss'

const props = defineProps<{
  index: number
  modelValue: SetInput
  minSetScore: number
  minWinMargin: number
  playerName: string
  opponentName: string
}>()

defineEmits<{
  'update:modelValue': [value: SetInput]
}>()

const rules = computed(() => ({
  minSetScore: props.minSetScore,
  minWinMargin: props.minWinMargin,
}))

const scores = computed(() => {
  const { user, adversaire } = props.modelValue
  if (user === '' || adversaire === '') return null
  const parsed = { user: Number(user), adversaire: Number(adversaire) }
  return Number.isNaN(parsed.user) || Number.isNaN(parsed.adversaire) ? null : parsed
})

const status = computed(() => {
  if (!scores.value) return 'empty'
  return isValidSetScore(scores.value.user, scores.value.adversaire, rules.value) ? 'valid' : 'invalid'
})

const statusLabel = computed(() => {
  if (!scores.value || status.value === 'invalid') return '✗'
  return getSetWinner(scores.value.user, scores.value.adversaire, rules.value) === 'user'
    ? `✓ ${props.playerName}`
    : `✓ ${props.opponentName}`
})
</script>

<template>
  <div class="set-row" :class="`set-row--${status}`">
    <div class="set-row__head">
      <span class="set-row__label">SET {{ index }}</span>
      <span v-if="status !== 'empty'" class="set-row__status">{{ statusLabel }}</span>
    </div>
    <div class="set-row__inputs">
      <label class="set-row__field">
        <span class="sr-only">{{ playerName }} set {{ index }}</span>
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
        <span class="set-row__name" aria-hidden="true">{{ playerName }}</span>
      </label>
      <span class="set-row__sep">—</span>
      <label class="set-row__field">
        <span class="sr-only">{{ opponentName }} set {{ index }}</span>
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
        <span class="set-row__name" aria-hidden="true">{{ opponentName }}</span>
      </label>
    </div>
  </div>
</template>
