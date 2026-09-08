import {
  BO5_WIN_SETS,
  MAX_SETS,
  MIN_SETS,
  MIN_SET_SCORE,
  MIN_WIN_MARGIN,
} from '@/constants/gameRules'
import type {
  MatchCompletion,
  SetInput,
  SetScore,
  SetWinner,
  ValidationResult,
} from '@/domain/types'

export function getSetWinner(user: number, adversaire: number): SetWinner {
  if (!isValidSetScore(user, adversaire)) return null
  return user > adversaire ? 'user' : 'adversaire'
}

export function isValidSetScore(user: number, adversaire: number): boolean {
  if (user < 0 || adversaire < 0) return false
  const max = Math.max(user, adversaire)
  const min = Math.min(user, adversaire)
  const diff = max - min
  if (max < MIN_SET_SCORE) return false
  if (diff < MIN_WIN_MARGIN) return false
  if (max === MIN_SET_SCORE && diff >= MIN_WIN_MARGIN) return true
  return diff === MIN_WIN_MARGIN
}

export function getMatchCompletion(sets: SetScore[]): MatchCompletion {
  let user = 0
  let adversaire = 0

  for (const [index, set] of sets.entries()) {
    const winner = getSetWinner(set.user, set.adversaire)
    if (winner === 'user') user += 1
    if (winner === 'adversaire') adversaire += 1

    if (user === BO5_WIN_SETS || adversaire === BO5_WIN_SETS) {
      return index === sets.length - 1 ? 'complete' : 'extra-sets'
    }
  }

  return 'unfinished'
}

export function isMatchComplete(sets: SetScore[]): boolean {
  return getMatchCompletion(sets) === 'complete'
}

function filledSets(sets: SetInput[]): SetInput[] {
  return sets.filter(
    (set) => set.user !== '' && set.user !== null && set.adversaire !== '' && set.adversaire !== null,
  )
}

export function validateMatch(sets: SetInput[]): ValidationResult {
  const errors: string[] = []
  const parsed: SetScore[] = filledSets(sets).map((set) => ({
    user: Number(set.user),
    adversaire: Number(set.adversaire),
  }))

  if (parsed.length < MIN_SETS) {
    errors.push(`Minimum ${MIN_SETS} sets requis.`)
    return { valid: false, errors, sets: parsed }
  }

  if (parsed.length > MAX_SETS) {
    errors.push(`Maximum ${MAX_SETS} sets autorisés.`)
    return { valid: false, errors, sets: parsed }
  }

  parsed.forEach((set, index) => {
    if (Number.isNaN(set.user) || Number.isNaN(set.adversaire)) {
      errors.push(`Set ${index + 1} : scores invalides.`)
      return
    }
    if (!isValidSetScore(set.user, set.adversaire)) {
      errors.push(
        `Set ${index + 1} : score invalide (${set.user}-${set.adversaire}). Gagnant ≥21, écart ≥2.`,
      )
    }
  })

  if (errors.length) return { valid: false, errors, sets: parsed }

  const completion = getMatchCompletion(parsed)
  if (completion === 'unfinished') {
    errors.push(`Match BO5 incomplet : un joueur doit gagner ${BO5_WIN_SETS} sets.`)
  } else if (completion === 'extra-sets') {
    errors.push(`Sets en trop : le match s'arrête dès qu'un joueur gagne ${BO5_WIN_SETS} sets.`)
  }

  return { valid: errors.length === 0, errors, sets: parsed }
}
