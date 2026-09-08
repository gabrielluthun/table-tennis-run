import { BO5_WIN_SETS } from '@/constants/gameRules'
import { calculateDistance } from '@/domain/calculateDistance'
import { detectMatchBadges } from '@/domain/detectMatchBadges'
import type { MatchAnalysis, MatchOutcome, SetScore } from '@/domain/types'

export function getMatchOutcome(sequence: ('W' | 'L')[]): MatchOutcome {
  const won = sequence.filter((set) => set === 'W').length
  return won >= BO5_WIN_SETS ? 'win' : 'loss'
}

export function analyzeMatch(sets: SetScore[]): MatchAnalysis {
  const result = calculateDistance(sets)
  const badges = detectMatchBadges(sets, result)

  return {
    distance: result.distance,
    sequence: result.sequence,
    multiplier: result.multiplier,
    outcome: getMatchOutcome(result.sequence),
    badges,
    setDetails: result.setDetails,
  }
}
