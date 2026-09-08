import { computed, ref } from 'vue'
import {
  buildGameRules,
  DEFAULT_SETTINGS,
  sanitizeSettings,
  type AppSettings,
} from '@/domain/settings'
import { settingsStorage } from '@/services/settingsStorage'

type StorageService = typeof settingsStorage

export function useSettings(storage: StorageService = settingsStorage) {
  const settings = ref<AppSettings>(storage.load())
  const rules = computed(() => buildGameRules(settings.value))

  function persist(next: AppSettings): void {
    settings.value = storage.save(next)
  }

  function patch(partial: Partial<AppSettings>): void {
    persist(sanitizeSettings({ ...settings.value, ...partial }))
  }

  function reset(): void {
    persist({ ...DEFAULT_SETTINGS })
  }

  return { settings, rules, patch, reset }
}
