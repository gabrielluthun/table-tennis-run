import type { GameRules } from '@/domain/settings'
import type { Badge, DistanceResult, SetScore } from '@/domain/types'

function earlySetsAre(sequence: ('W' | 'L')[], winSets: number, value: 'W' | 'L'): boolean {
  const needed = Math.max(winSets - 1, 1)
  if (sequence.length < needed) return false
  return sequence.slice(0, needed).every((set) => set === value)
}

export function detectMatchBadges(
  sets: SetScore[],
  meta: DistanceResult,
  rules: GameRules,
): Badge[] {
  const badges: Badge[] = []
  const { sequence, setsGagnes, setsPerdus } = meta

  sets.forEach((set, index) => {
    const diff = set.adversaire - set.user
    const setNum = index + 1
    const totalPoints = set.user + set.adversaire

    if (diff < 0 && set.adversaire < rules.bubbleThreshold) {
      badges.push({
        id: `set-blanc-inflige-${setNum}`,
        label: `SET BLANC INFLIGÉ (Set ${setNum})`,
        type: 'set-blanc-inflige',
      })
    }

    if (diff > 0 && set.user < rules.bubbleThreshold) {
      badges.push({
        id: `set-blanc-subi-${setNum}`,
        label: `SET BLANC SUBI (Set ${setNum})`,
        type: 'set-blanc-subi',
      })
    }

    if (totalPoints > rules.deuceTotalThreshold) {
      badges.push({
        id: `deuce-${setNum}`,
        label: `PROLONGATION DEUCE (Set ${setNum})`,
        type: 'deuce',
      })
    }
  })

  if (setsPerdus === rules.winSets) {
    if (earlySetsAre(sequence, rules.winSets, 'W')) {
      badges.push({ id: 'choke', label: '💀 CHOKE (×1.5)', type: 'choke' })
    } else {
      badges.push({ id: 'sweep-subi', label: 'SWEEP SUBI (×1.3)', type: 'sweep-subi' })
    }
  }

  if (setsGagnes === rules.winSets) {
    if (earlySetsAre(sequence, rules.winSets, 'L')) {
      badges.push({ id: 'remontada', label: '🔥 REMONTADA (×0.5)', type: 'remontada' })
    } else {
      badges.push({ id: 'domination', label: 'DOMINATION (×0.7)', type: 'domination' })
    }
  }

  return badges
}
