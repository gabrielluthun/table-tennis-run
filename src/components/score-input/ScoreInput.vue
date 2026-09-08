<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { DEFAULT_VISIBLE_SETS, MAX_SETS, MIN_SETS } from '@/constants/gameRules'
import type { SetInput } from '@/domain/types'
import SetScoreRow from './SetScoreRow.vue'
import './ScoreInput.scss'

const props = defineProps<{
  errors?: string[]
}>()

const emit = defineEmits<{
  submit: [sets: SetInput[]]
}>()

const emptySet = (): SetInput => ({ user: '', adversaire: '' })
const formRef = ref<HTMLFormElement | null>(null)
const visibleCount = ref(DEFAULT_VISIBLE_SETS)
const sets = ref<SetInput[]>(Array.from({ length: DEFAULT_VISIBLE_SETS }, emptySet))

onMounted(focusFirstInput)

function focusFirstInput(): void {
  nextTick(() => formRef.value?.querySelector('input')?.focus())
}

function addSet(): void {
  if (visibleCount.value >= MAX_SETS) return
  visibleCount.value += 1
  sets.value.push(emptySet())
}

function removeSet(): void {
  if (visibleCount.value <= MIN_SETS) return
  visibleCount.value -= 1
  sets.value.pop()
}

function handleSubmit(): void {
  emit('submit', sets.value.slice(0, visibleCount.value))
}

function resetForm(): void {
  visibleCount.value = DEFAULT_VISIBLE_SETS
  sets.value = Array.from({ length: DEFAULT_VISIBLE_SETS }, emptySet)
  focusFirstInput()
}

defineExpose({ resetForm })
</script>

<template>
  <form ref="formRef" class="score-input" novalidate @submit.prevent="handleSubmit">
    <h2 class="score-input__title">MATCH TERMINÉ ?<br />BALANCE TES SCORES</h2>

    <div class="score-input__sets">
      <SetScoreRow
        v-for="(_, i) in visibleCount"
        :key="i"
        :index="i + 1"
        :model-value="sets[i]"
        @update:model-value="sets[i] = $event"
      />
    </div>

    <div class="score-input__actions">
      <button
        v-if="visibleCount > MIN_SETS"
        type="button"
        class="score-input__remove"
        @click="removeSet"
      >
        − SET {{ visibleCount }}
      </button>
      <button v-if="visibleCount < MAX_SETS" type="button" class="score-input__add" @click="addSet">
        + SET {{ visibleCount + 1 }}
      </button>
    </div>

    <ul v-if="props.errors?.length" class="score-input__errors" aria-live="polite">
      <li v-for="(err, i) in props.errors" :key="i">{{ err }}</li>
    </ul>

    <button type="submit" class="score-input__submit">DÉFINIR MON PROCHAIN RUN</button>
  </form>
</template>
