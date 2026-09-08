const ID_PREFIX = 'match'

function hasRandomUuid(): boolean {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
}

function randomSuffix(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    return Array.from(crypto.getRandomValues(new Uint32Array(2)), (n) => n.toString(36)).join('')
  }
  return Math.random().toString(36).slice(2, 12)
}

/**
 * `crypto.randomUUID` is only exposed in secure contexts, so it is missing when
 * the app is opened over plain HTTP from another device on the local network.
 */
export function generateMatchId(): string {
  if (hasRandomUuid()) return crypto.randomUUID()
  return `${ID_PREFIX}-${Date.now().toString(36)}-${randomSuffix()}`
}
