import type { MatchRecord } from '@/domain/types'

function isMatchRecord(value: unknown): value is MatchRecord {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Partial<MatchRecord>
  return (
    typeof record.id === 'string' &&
    typeof record.date === 'string' &&
    Array.isArray(record.sets) &&
    typeof record.distance === 'number' &&
    Array.isArray(record.sequence)
  )
}

function normalizeMatch(record: MatchRecord): MatchRecord {
  return {
    ...record,
    pityMode: Boolean(record.pityMode),
    badges: Array.isArray(record.badges) ? record.badges : [],
    multiplier: typeof record.multiplier === 'number' ? record.multiplier : 1,
    outcome: record.outcome === 'win' || record.outcome === 'loss' ? record.outcome : 'loss',
  }
}

export function parseImportedMatches(raw: string): MatchRecord[] {
  const data: unknown = JSON.parse(raw)
  const list = Array.isArray(data) ? data : (data as { matches?: unknown }).matches
  if (!Array.isArray(list) || !list.every(isMatchRecord)) {
    throw new Error('Fichier invalide : historique attendu.')
  }
  return list.map(normalizeMatch)
}

export function downloadMatches(matches: MatchRecord[]): void {
  const blob = new Blob([JSON.stringify({ matches }, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const stamp = new Date().toISOString().slice(0, 10)
  const link = document.createElement('a')
  link.href = url
  link.download = `table-tennis-run-${stamp}.json`
  link.click()
  URL.revokeObjectURL(url)
}
