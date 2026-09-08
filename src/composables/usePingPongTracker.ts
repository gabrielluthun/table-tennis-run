import { ref, computed } from 'vue'
import { analyzeMatch } from '@/domain/analyzeMatch'
import { validateMatch } from '@/domain/setValidation'
import type { MatchRecord, SetInput } from '@/domain/types'
import { generateMatchId } from '@/services/idGenerator'
import { matchStorage } from '@/services/matchStorage'

export type AppStep = 'input' | 'reveal'

type StorageService = typeof matchStorage

export function usePingPongTracker(storage: StorageService = matchStorage) {
  const saved = storage.load()
  const matches = ref<MatchRecord[]>(saved?.matches ?? [])
  const currentStep = ref<AppStep>('input')
  const lastResult = ref<MatchRecord | null>(null)
  const formErrors = ref<string[]>([])

  const totalKm = computed(() =>
    Math.round(matches.value.reduce((sum, m) => sum + m.distance, 0) * 10) / 10,
  )

  function submitMatch(sets: SetInput[]): boolean {
    const validation = validateMatch(sets)
    if (!validation.valid) {
      formErrors.value = validation.errors
      return false
    }

    const analysis = analyzeMatch(validation.sets)
    const match: MatchRecord = {
      id: generateMatchId(),
      date: new Date().toISOString(),
      sets: validation.sets,
      ...analysis,
    }

    matches.value = [match, ...matches.value]
    storage.save({ matches: matches.value })
    lastResult.value = match
    formErrors.value = []
    currentStep.value = 'reveal'
    return true
  }

  function resetToInput(): void {
    currentStep.value = 'input'
    lastResult.value = null
    formErrors.value = []
  }

  function clearHistory(): void {
    storage.clear()
    matches.value = []
    resetToInput()
  }

  return {
    matches,
    totalKm,
    currentStep,
    lastResult,
    formErrors,
    submitMatch,
    resetToInput,
    clearHistory,
  }
}
