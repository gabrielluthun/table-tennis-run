import type { DistanceResult, SetScore } from '@/domain/types'

export function calculateDistance(sets: SetScore[]): DistanceResult {
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
      if (set.adversaire < 10) setDistance -= 1.5 * pressionJeu
      setsGagnes++
    } else if (diff > 0) {
      sequence.push('L')
      setDistance = 2 + Math.pow(diff * 0.3, 1.5)
      if (set.user < 10) setDistance += 2.5 * pressionJeu
      setsPerdus++
    }

    const totalPoints = set.user + set.adversaire
    if (totalPoints > 40) setDistance += (totalPoints - 40) * 0.2

    setDistance = Math.max(0, setDistance)
    totalDistance += setDistance
    setDetails.push({ index: index + 1, setDistance, pressionJeu })
  })

  let matchMultiplier = 1

  if (setsPerdus === 3) {
    matchMultiplier = 1.3
    if (sequence[0] === 'W' && sequence[1] === 'W') matchMultiplier = 1.5
  } else if (setsGagnes === 3) {
    matchMultiplier = 0.7
    if (sequence[0] === 'L' && sequence[1] === 'L') matchMultiplier = 0.5
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
