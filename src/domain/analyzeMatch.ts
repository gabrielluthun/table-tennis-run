import { BO5_WIN_SETS } from '@/constants/gameRules'
import { calculateDistance } from '@/domain/calculateDistance'
import { detectMatchBadges } from '@/domain/detectMatchBadges'
import type { GameRules } from '@/domain/settings'
import type { MatchAnalysis, MatchOutcome, SetScore } from '@/domain/types'

export function getMatchOutcome(
  sequence: ('W' | 'L')[],
  winSets: number = BO5_WIN_SETS,
): MatchOutcome {
  const won = sequence.filter((set) => set === 'W').length
  return won >= winSets ? 'win' : 'loss'
}

export function analyzeMatch(sets: SetScore[], rules: GameRules): MatchAnalysis {
  const result = calculateDistance(sets, rules)
  const badges = detectMatchBadges(sets, result, rules)

  return {
    distance: result.distance,
    sequence: result.sequence,
    multiplier: result.multiplier,
    outcome: getMatchOutcome(result.sequence, rules.winSets),
    badges,
    setDetails: result.setDetails,
  }
}
