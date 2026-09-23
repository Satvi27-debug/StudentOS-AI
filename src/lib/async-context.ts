import { AsyncLocalStorage } from 'node:async_hooks'

type RequestContext = { userId: string }

/**
 * Per-request storage so tools executed inside Mastra agents can
 * identify the current student without global mutable state.
 */
const store = new AsyncLocalStorage<RequestContext>()

export function runWithUser<T>(userId: string, fn: () => Promise<T>): Promise<T> {
  return store.run({ userId }, fn)
}

/** Current user id inside a request. Falls back to 'local' in dev mode. */
export function currentUserId(): string {
  return store.getStore()?.userId ?? 'local'
}
