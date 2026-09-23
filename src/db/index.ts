import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

export type DB = NodePgDatabase<typeof schema>

let pool: Pool | null = null
let db: DB | null = null

export function dbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

function getDb(): DB {
  if (!db) {
    if (!dbConfigured()) {
      throw new Error(
        'DATABASE_URL is not set. Copy .env.example to .env and run: npm run db:setup'
      )
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      connectionTimeoutMillis: 5000,
    })
    db = drizzle(pool, { schema })
  }
  return db
}

export type QueryResult<T> = {
  data: T | null
  error: string | null
}

/**
 * Run a database query without ever throwing.
 * Every caller gets either data or a human-readable error,
 * so pages and agents can communicate limitations instead of crashing.
 */
export async function tryDb<T>(
  fn: (db: DB) => Promise<T>
): Promise<QueryResult<T>> {
  if (!dbConfigured()) {
    return {
      data: null,
      error: 'Database is not configured (DATABASE_URL missing).',
    }
  }
  try {
    return { data: await fn(getDb()), error: null }
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e.message : 'Unknown database error',
    }
  }
}

/** Lightweight connectivity check for setup notices. */
export async function checkDbConnection(): Promise<{ ok: boolean; error: string | null }> {
  const res = await tryDb(async (d) => {
    await d.execute('select 1')
    return true
  })
  return { ok: res.error === null, error: res.error }
}
