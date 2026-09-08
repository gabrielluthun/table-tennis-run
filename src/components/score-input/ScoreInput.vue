<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { DEFAULT_VISIBLE_SETS, MAX_SETS } from '@/constants/gameRules'
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
const visibleCount = ref(DEFAULT_VISIBLE_SETS)
const sets = ref<SetInput[]>(Array.from({ length: DEFAULT_VISIBLE_SETS }, emptySet))

onMounted(() => {
  nextTick(() => document.getElementById('set-1-user')?.focus())
})

function addSet(): void {
  if (visibleCount.value >= MAX_SETS) return
  visibleCount.value += 1
  sets.value.push(emptySet())
}

function handleSubmit(): void {
  emit('submit', sets.value.slice(0, visibleCount.value))
}

function resetForm(): void {
  visibleCount.value = DEFAULT_VISIBLE_SETS
  sets.value = Array.from({ length: DEFAULT_VISIBLE_SETS }, emptySet)
  nextTick(() => document.getElementById('set-1-user')?.focus())
}

defineExpose({ resetForm })
</script>

<template>
  <section class="score-input">
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

    <div v-if="visibleCount < MAX_SETS" class="score-input__actions">
      <button type="button" class="score-input__add" @click="addSet">
        + {{ visibleCount + 1 }}e SET
      </button>
    </div>

    <ul v-if="props.errors?.length" class="score-input__errors" aria-live="polite">
      <li v-for="(err, i) in props.errors" :key="i">{{ err }}</li>
    </ul>

    <button type="button" class="score-input__submit" @click="handleSubmit">
      DÈFINIR MON PROCHAIN RUN
    </button>
  </section>
</template>
