import Link from 'next/link'
import { checkDbConnection, dbConfigured } from '@/db'
import { aiConfigured } from '@/mastra/models'
import { clerkEnabled } from '@/lib/auth-client'

type Check = { label: string; ready: boolean; detail: string }

/**
 * Environment checklist shown when something is not configured.
 * Renders nothing when everything is ready.
 */
export async function SetupNotice() {
  const db = await checkDbConnection()

  const checks: Check[] = [
    {
      label: 'PostgreSQL database',
      ready: db.ok,
      detail: db.ok
        ? 'Connected.'
        : dbConfigured()
          ? `Not reachable: ${db.error ?? 'unknown error'}. Run: npm run db:setup`
          : 'DATABASE_URL not set.',
    },
    {
      label: 'Gemini API key',
      ready: aiConfigured,
      detail: aiConfigured
        ? 'Configured.'
        : 'Set GOOGLE_API_KEY in .env to enable the AI Assistant.',
    },
    {
      label: 'Clerk (optional)',
      ready: clerkEnabled,
      detail: clerkEnabled ? 'Enabled.' : 'Optional — running in local mode.',
    },
  ]

  const allReady = checks.every((c) => c.ready)
  if (allReady) return null

  return (
    <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-5">
      <p className="text-sm font-semibold text-amber-900">
        StudentOS is not fully configured yet
      </p>
      <p className="mt-1 text-sm text-amber-800">
        The app runs, but some features need environment setup. Copy{' '}
        <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">.env.example</code>{' '}
        to{' '}
        <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">.env</code> and
        follow these steps:
      </p>
      <ul className="mt-3 space-y-1.5">
        {checks.map((c) => (
          <li key={c.label} className="flex items-start gap-2 text-sm text-amber-900">
            <span
              className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${
                c.ready ? 'bg-green-600' : 'bg-amber-500'
              }`}
            />
            <span>
              <span className="font-medium">{c.label}:</span> {c.detail}
            </span>
          </li>
        ))}
      </ul>
      {!checks[0].ready ? (
        <p className="mt-3 text-sm text-amber-900">
          Quick start:{' '}
          <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">
            docker compose up -d
          </code>{' '}
          then{' '}
          <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">
            npm run db:push
          </code>
          .
        </p>
      ) : null}
      <Link
        href="/assistant"
        className="mt-3 inline-block text-sm font-medium text-amber-900 underline underline-offset-2"
      >
        Open the AI Assistant →
      </Link>
    </div>
  )
}