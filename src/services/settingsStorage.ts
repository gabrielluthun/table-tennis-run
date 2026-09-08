import { SETTINGS_KEY } from '@/constants/storageKeys'
import { DEFAULT_SETTINGS, sanitizeSettings, type AppSettings } from '@/domain/settings'

export const settingsStorage = {
  load(): AppSettings {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY)
      if (!raw) return { ...DEFAULT_SETTINGS }
      return sanitizeSettings(JSON.parse(raw) as Partial<AppSettings>)
    } catch {
      return { ...DEFAULT_SETTINGS }
    }
  },

  save(settings: AppSettings): AppSettings {
    const payload = sanitizeSettings(settings)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload))
    return payload
  },

  clear(): void {
    localStorage.removeItem(SETTINGS_KEY)
  },
}
