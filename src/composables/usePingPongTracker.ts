import { ref, computed } from 'vue'
import { analyzeMatch } from '@/domain/analyzeMatch'
import { validateMatch } from '@/domain/setValidation'
import type { GameRules } from '@/domain/settings'
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

  function submitMatch(sets: SetInput[], rules: GameRules): boolean {
    const validation = validateMatch(sets, rules)
    if (!validation.valid) {
      formErrors.value = validation.errors
      return false
    }

    const analysis = analyzeMatch(validation.sets, rules)
    const match: MatchRecord = {
      id: generateMatchId(),
      date: new Date().toISOString(),
      sets: validation.sets,
      ...analysis,
    }

    persist([match, ...matches.value])
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

  function persist(next: MatchRecord[]): void {
    matches.value = next
    storage.save({ matches: next })
  }

  function deleteMatch(id: string): void {
    persist(matches.value.filter((match) => match.id !== id))
    if (lastResult.value?.id === id) resetToInput()
  }

  function replaceMatches(next: MatchRecord[]): void {
    persist(next)
    resetToInput()
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
    deleteMatch,
    replaceMatches,
    clearHistory,
  }
}
