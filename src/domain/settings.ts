import type { MatchFormat, SetTarget } from '@/domain/types'

export interface AppSettings {
  playerName: string
  opponentName: string
  format: MatchFormat
  setTarget: SetTarget
  confirmMatchDelete: boolean
  soundEnabled: boolean
}

export interface GameRules {
  format: MatchFormat
  minSetScore: number
  minWinMargin: number
  winSets: number
  minSets: number
  maxSets: number
  bubbleThreshold: number
  deuceTotalThreshold: number
}

export const DEFAULT_SETTINGS: AppSettings = {
  playerName: 'TOI',
  opponentName: 'ADV',
  format: 'BO5',
  setTarget: 21,
  confirmMatchDelete: false,
  soundEnabled: false,
}

const NAME_MAX = 12

function clipName(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback
  const clipped = value.trim().slice(0, NAME_MAX)
  return clipped || fallback
}

export function buildGameRules(settings: Pick<AppSettings, 'format' | 'setTarget'>): GameRules {
  const winSets = settings.format === 'BO3' ? 2 : 3
  const minSetScore = settings.setTarget

  return {
    format: settings.format,
    minSetScore,
    minWinMargin: 2,
    winSets,
    minSets: winSets,
    maxSets: settings.format === 'BO3' ? 3 : 5,
    bubbleThreshold: Math.floor(minSetScore / 2),
    deuceTotalThreshold: minSetScore * 2,
  }
}

export function sanitizeSettings(raw: Partial<AppSettings> | null | undefined): AppSettings {
  const format: MatchFormat = raw?.format === 'BO3' ? 'BO3' : 'BO5'
  const setTarget: SetTarget = raw?.setTarget === 11 ? 11 : 21

  return {
    playerName: clipName(raw?.playerName, DEFAULT_SETTINGS.playerName),
    opponentName: clipName(raw?.opponentName, DEFAULT_SETTINGS.opponentName),
    format,
    setTarget,
    confirmMatchDelete: Boolean(raw?.confirmMatchDelete),
    soundEnabled: Boolean(raw?.soundEnabled),
  }
}
