import { BO5_WIN_SETS, PITY_SCALE } from '@/constants/gameRules'
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

export function analyzeMatch(
  sets: SetScore[],
  rules: GameRules,
  options: { pityMode?: boolean } = {},
): MatchAnalysis {
  const pityMode = Boolean(options.pityMode)
  const result = calculateDistance(sets, rules)
  const badges = detectMatchBadges(sets, result, rules)

  let distance = result.distance
  if (pityMode) {
    distance = Math.round(distance * PITY_SCALE * 10) / 10
    badges.push({ id: 'pity', label: 'MODE PITIÉ', type: 'pity' })
  }

  return {
    distance,
    sequence: result.sequence,
    multiplier: result.multiplier,
    outcome: getMatchOutcome(result.sequence, rules.winSets),
    badges,
    setDetails: result.setDetails,
    pityMode,
  }
}
