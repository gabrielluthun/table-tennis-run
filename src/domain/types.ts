export interface SetScore {
  user: number
  adversaire: number
}

export interface SetInput {
  user: string | number
  adversaire: string | number
}

export interface Badge {
  id: string
  label: string
  type: string
}

export interface SetDetail {
  index: number
  setDistance: number
  pressionJeu: number
}

export interface DistanceResult {
  distance: number
  sequence: ('W' | 'L')[]
  multiplier: number
  rawTotal: number
  setsGagnes: number
  setsPerdus: number
  setDetails: SetDetail[]
}

export type MatchOutcome = 'win' | 'loss'

export interface MatchAnalysis {
  distance: number
  sequence: ('W' | 'L')[]
  multiplier: number
  outcome: MatchOutcome
  badges: Badge[]
  setDetails: SetDetail[]
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  sets: SetScore[]
}

export type SetWinner = 'user' | 'adversaire' | null

export type MatchCompletion = 'complete' | 'unfinished' | 'extra-sets'

export interface MatchRecord {
  id: string
  date: string
  sets: SetScore[]
  distance: number
  sequence: ('W' | 'L')[]
  multiplier: number
  outcome: MatchOutcome
  badges: Badge[]
}

export interface StorageData {
  matches: MatchRecord[]
  totalKm: number
}

export interface MatchStats {
  played: number
  wins: number
  losses: number
  averageKm: number
  worstKm: number
}
