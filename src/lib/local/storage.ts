const STORAGE_KEY = 'studentos-state-v1'

/**
 * localStorage abstraction — the only place that touches localStorage.
 * Level 2 can swap this for a backend client without touching components.
 */
export function saveState(state: unknown): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage full or unavailable — fail silently, app keeps working in-memory
  }
}

export function loadState<T>(fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    // corrupted data — fall back to seed instead of crashing
    return fallback
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}