import { getMatchOutcome } from '@/domain/analyzeMatch'
import type { MatchRecord, MatchStats } from '@/domain/types'

function roundKm(value: number): number {
  return Math.round(value * 10) / 10
}

export function summarizeMatches(matches: MatchRecord[]): MatchStats {
  const played = matches.length
  if (played === 0) {
    return { played: 0, wins: 0, losses: 0, averageKm: 0, worstKm: 0 }
  }

  let wins = 0
  let totalKm = 0
  let worstKm = 0

  for (const match of matches) {
    const outcome = match.outcome ?? getMatchOutcome(match.sequence)
    if (outcome === 'win') wins += 1
    totalKm += match.distance
    if (match.distance > worstKm) worstKm = match.distance
  }

  return {
    played,
    wins,
    losses: played - wins,
    averageKm: roundKm(totalKm / played),
    worstKm: roundKm(worstKm),
  }
}
