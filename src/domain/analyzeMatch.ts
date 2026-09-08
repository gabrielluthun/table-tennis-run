import { calculateDistance } from '@/domain/calculateDistance'
import { detectMatchBadges } from '@/domain/detectMatchBadges'
import type { MatchAnalysis, SetScore } from '@/domain/types'

export function analyzeMatch(sets: SetScore[]): MatchAnalysis {
  const result = calculateDistance(sets)
  const badges = detectMatchBadges(sets, result)

  return {
    distance: result.distance,
    sequence: result.sequence,
    multiplier: result.multiplier,
    badges,
    setDetails: result.setDetails,
  }
}
