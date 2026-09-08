import { BUBBLE_THRESHOLD, DEUCE_TOTAL_THRESHOLD } from '@/constants/gameRules'
import type { Badge, DistanceResult, SetScore } from '@/domain/types'

export function detectMatchBadges(sets: SetScore[], meta: DistanceResult): Badge[] {
  const badges: Badge[] = []
  const { sequence, multiplier, setsGagnes, setsPerdus } = meta

  sets.forEach((set, index) => {
    const diff = set.adversaire - set.user
    const setNum = index + 1
    const totalPoints = set.user + set.adversaire

    if (diff < 0 && set.adversaire < BUBBLE_THRESHOLD) {
      badges.push({
        id: `bulle-infligee-${setNum}`,
        label: `BULLE INFLIGÉE (Set ${setNum})`,
        type: 'bulle-infligee',
      })
    }

    if (diff > 0 && set.user < BUBBLE_THRESHOLD) {
      badges.push({
        id: `bulle-subie-${setNum}`,
        label: `BULLE SUBIE (Set ${setNum})`,
        type: 'bulle-subie',
      })
    }

    if (totalPoints > DEUCE_TOTAL_THRESHOLD) {
      badges.push({
        id: `deuce-${setNum}`,
        label: `PROLONGATION DEUCE (Set ${setNum})`,
        type: 'deuce',
      })
    }
  })

  if (setsPerdus === 3) {
    if (sequence[0] === 'W' && sequence[1] === 'W') {
      badges.push({ id: 'choke', label: '💀 CHOKE (×1.5)', type: 'choke' })
    } else {
      badges.push({ id: 'sweep-subi', label: 'SWEEP SUBI (×1.3)', type: 'sweep-subi' })
    }
  }

  if (setsGagnes === 3) {
    if (sequence[0] === 'L' && sequence[1] === 'L') {
      badges.push({ id: 'remontada', label: '🔥 REMONTADA (×0.5)', type: 'remontada' })
    } else {
      badges.push({ id: 'domination', label: 'DOMINATION (×0.7)', type: 'domination' })
    }
  }

  if (multiplier !== 1) {
    badges.push({
      id: 'multiplier',
      label: `MULTIPLICATEUR ×${multiplier}`,
      type: 'multiplier',
    })
  }

  return badges
}
