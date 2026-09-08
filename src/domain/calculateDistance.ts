import type { GameRules } from '@/domain/settings'
import type { DistanceResult, SetScore } from '@/domain/types'

function earlySetsAre(sequence: ('W' | 'L')[], winSets: number, value: 'W' | 'L'): boolean {
  const needed = Math.max(winSets - 1, 1)
  if (sequence.length < needed) return false
  return sequence.slice(0, needed).every((set) => set === value)
}

export function calculateDistance(sets: SetScore[], rules: GameRules): DistanceResult {
  let totalDistance = 0
  let setsGagnes = 0
  let setsPerdus = 0
  const sequence: ('W' | 'L')[] = []
  const setDetails: DistanceResult['setDetails'] = []

  sets.forEach((set, index) => {
    const diff = set.adversaire - set.user
    let setDistance = 0
    const pressionJeu = 1 + index * 0.2

    if (diff < 0) {
      sequence.push('W')
      setDistance = 1.5 + set.adversaire * 0.1
      if (set.adversaire < rules.bubbleThreshold) setDistance -= 1.5 * pressionJeu
      setsGagnes++
    } else if (diff > 0) {
      sequence.push('L')
      setDistance = 2 + Math.pow(diff * 0.3, 1.5)
      if (set.user < rules.bubbleThreshold) setDistance += 2.5 * pressionJeu
      setsPerdus++
    }

    const totalPoints = set.user + set.adversaire
    if (totalPoints > rules.deuceTotalThreshold) {
      setDistance += (totalPoints - rules.deuceTotalThreshold) * 0.2
    }

    setDistance = Math.max(0, setDistance)
    totalDistance += setDistance
    setDetails.push({ index: index + 1, setDistance, pressionJeu })
  })

  let matchMultiplier = 1

  if (setsPerdus === rules.winSets) {
    matchMultiplier = earlySetsAre(sequence, rules.winSets, 'W') ? 1.5 : 1.3
  } else if (setsGagnes === rules.winSets) {
    matchMultiplier = earlySetsAre(sequence, rules.winSets, 'L') ? 0.5 : 0.7
  }

  const distance = Math.round(totalDistance * matchMultiplier * 10) / 10

  return {
    distance,
    sequence,
    multiplier: matchMultiplier,
    rawTotal: totalDistance,
    setsGagnes,
    setsPerdus,
    setDetails,
  }
}
