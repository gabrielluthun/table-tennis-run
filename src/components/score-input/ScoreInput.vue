<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import type { GameRules } from '@/domain/settings'
import type { SetInput } from '@/domain/types'
import SetScoreRow from './SetScoreRow.vue'
import './ScoreInput.scss'

const props = defineProps<{
  errors?: string[]
  rules: GameRules
  playerName: string
  opponentName: string
}>()

const emit = defineEmits<{
  submit: [sets: SetInput[]]
}>()

const emptySet = (): SetInput => ({ user: '', adversaire: '' })
const formRef = ref<HTMLFormElement | null>(null)
const visibleCount = ref(props.rules.minSets)
const sets = ref<SetInput[]>(Array.from({ length: props.rules.minSets }, emptySet))

onMounted(focusFirstInput)

function focusFirstInput(): void {
  nextTick(() => formRef.value?.querySelector('input')?.focus())
}

function addSet(): void {
  if (visibleCount.value >= props.rules.maxSets) return
  visibleCount.value += 1
  sets.value.push(emptySet())
}

function removeSet(): void {
  if (visibleCount.value <= props.rules.minSets) return
  visibleCount.value -= 1
  sets.value.pop()
}

function handleSubmit(): void {
  emit('submit', sets.value.slice(0, visibleCount.value))
}

function resetForm(): void {
  visibleCount.value = props.rules.minSets
  sets.value = Array.from({ length: props.rules.minSets }, emptySet)
  focusFirstInput()
}

defineExpose({ resetForm })
</script>

<template>
  <form ref="formRef" class="score-input" novalidate @submit.prevent="handleSubmit">
    <h2 class="score-input__title">MATCH TERMINÉ ?<br />BALANCE TES SCORES</h2>
    <p class="score-input__meta">{{ rules.format }} · SET À {{ rules.minSetScore }}</p>

    <div class="score-input__sets">
      <SetScoreRow
        v-for="(_, i) in visibleCount"
        :key="i"
        :index="i + 1"
        :model-value="sets[i]"
        :min-set-score="rules.minSetScore"
        :min-win-margin="rules.minWinMargin"
        :player-name="playerName"
        :opponent-name="opponentName"
        @update:model-value="sets[i] = $event"
      />
    </div>

    <div class="score-input__actions">
      <button
        v-if="visibleCount > rules.minSets"
        type="button"
        class="score-input__remove"
        @click="removeSet"
      >
        − SET {{ visibleCount }}
      </button>
      <button
        v-if="visibleCount < rules.maxSets"
        type="button"
        class="score-input__add"
        @click="addSet"
      >
        + SET {{ visibleCount + 1 }}
      </button>
    </div>

    <ul v-if="props.errors?.length" class="score-input__errors" aria-live="polite">
      <li v-for="(err, i) in props.errors" :key="i">{{ err }}</li>
    </ul>

    <button type="submit" class="score-input__submit">DÉFINIR MON PROCHAIN RUN</button>
  </form>
</template>
