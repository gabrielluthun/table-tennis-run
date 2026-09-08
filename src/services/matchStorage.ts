import { STORAGE_KEY } from '@/constants/storageKeys'
import type { MatchRecord, StorageData } from '@/domain/types'

function computeTotalKm(matches: MatchRecord[]): number {
  return Math.round(matches.reduce((sum, m) => sum + m.distance, 0) * 10) / 10
}

export const matchStorage = {
  load(): StorageData | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const data = JSON.parse(raw) as StorageData
      const matches = data.matches ?? []
      return { matches, totalKm: computeTotalKm(matches) }
    } catch {
      return null
    }
  },

  save(data: Pick<StorageData, 'matches'>): StorageData {
    const payload: StorageData = {
      matches: data.matches,
      totalKm: computeTotalKm(data.matches),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    return payload
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY)
  },
}
