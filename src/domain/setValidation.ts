import type { GameRules } from '@/domain/settings'
import type {
  MatchCompletion,
  SetInput,
  SetScore,
  SetWinner,
  ValidationResult,
} from '@/domain/types'

export function getSetWinner(
  user: number,
  adversaire: number,
  rules: Pick<GameRules, 'minSetScore' | 'minWinMargin'>,
): SetWinner {
  if (!isValidSetScore(user, adversaire, rules)) return null
  return user > adversaire ? 'user' : 'adversaire'
}

export function isValidSetScore(
  user: number,
  adversaire: number,
  rules: Pick<GameRules, 'minSetScore' | 'minWinMargin'>,
): boolean {
  if (user < 0 || adversaire < 0) return false
  const max = Math.max(user, adversaire)
  const min = Math.min(user, adversaire)
  const diff = max - min
  if (max < rules.minSetScore) return false
  if (diff < rules.minWinMargin) return false
  if (max === rules.minSetScore && diff >= rules.minWinMargin) return true
  return diff === rules.minWinMargin
}

export function getMatchCompletion(sets: SetScore[], rules: GameRules): MatchCompletion {
  let user = 0
  let adversaire = 0

  for (const [index, set] of sets.entries()) {
    const winner = getSetWinner(set.user, set.adversaire, rules)
    if (winner === 'user') user += 1
    if (winner === 'adversaire') adversaire += 1

    if (user === rules.winSets || adversaire === rules.winSets) {
      return index === sets.length - 1 ? 'complete' : 'extra-sets'
    }
  }

  return 'unfinished'
}

export function isMatchComplete(sets: SetScore[], rules: GameRules): boolean {
  return getMatchCompletion(sets, rules) === 'complete'
}

function filledSets(sets: SetInput[]): SetInput[] {
  return sets.filter(
    (set) => set.user !== '' && set.user !== null && set.adversaire !== '' && set.adversaire !== null,
  )
}

export function validateMatch(sets: SetInput[], rules: GameRules): ValidationResult {
  const errors: string[] = []
  const parsed: SetScore[] = filledSets(sets).map((set) => ({
    user: Number(set.user),
    adversaire: Number(set.adversaire),
  }))

  if (parsed.length < rules.minSets) {
    errors.push(`Minimum ${rules.minSets} sets requis.`)
    return { valid: false, errors, sets: parsed }
  }

  if (parsed.length > rules.maxSets) {
    errors.push(`Maximum ${rules.maxSets} sets autorisés.`)
    return { valid: false, errors, sets: parsed }
  }

  parsed.forEach((set, index) => {
    if (Number.isNaN(set.user) || Number.isNaN(set.adversaire)) {
      errors.push(`Set ${index + 1} : scores invalides.`)
      return
    }
    if (!isValidSetScore(set.user, set.adversaire, rules)) {
      errors.push(
        `Set ${index + 1} : score invalide (${set.user}-${set.adversaire}). Gagnant ≥${rules.minSetScore}, écart ≥${rules.minWinMargin}.`,
      )
    }
  })

  if (errors.length) return { valid: false, errors, sets: parsed }

  const completion = getMatchCompletion(parsed, rules)
  if (completion === 'unfinished') {
    errors.push(`Match ${rules.format} incomplet : un joueur doit gagner ${rules.winSets} sets.`)
  } else if (completion === 'extra-sets') {
    errors.push(`Sets en trop : le match s'arrête dès qu'un joueur gagne ${rules.winSets} sets.`)
  }

  return { valid: errors.length === 0, errors, sets: parsed }
}
