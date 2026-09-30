import Link from 'next/link'
import { checkDbConnection, dbConfigured } from '@/db'
import { aiConfigured } from '@/mastra/models'
import { clerkEnabled } from '@/lib/auth-client'
import { IconDatabase, IconKey, IconShield } from '@/components/icons'

type Check = { label: string; ready: boolean; detail: string; icon: React.ReactNode }

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
      icon: <IconDatabase className="h-4 w-4" />,
    },
    {
      label: 'Gemini API key',
      ready: aiConfigured,
      detail: aiConfigured
        ? 'Configured.'
        : 'Set GOOGLE_API_KEY in .env to enable the AI Assistant.',
      icon: <IconKey className="h-4 w-4" />,
    },
    {
      label: 'Clerk (optional)',
      ready: clerkEnabled,
      detail: clerkEnabled ? 'Enabled.' : 'Optional — running in local mode.',
      icon: <IconShield className="h-4 w-4" />,
    },
  ]

  const allReady = checks.every((c) => c.ready)
  if (allReady) return null

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm animate-fade-in-up">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
          <IconKey className="h-4.5 w-4.5" />
        </span>
        <div>
          <p className="text-sm font-bold text-amber-900">
            StudentOS is not fully configured yet
          </p>
          <p className="mt-0.5 text-sm text-amber-800">
            The app runs, but some features need environment setup. Copy{' '}
            <code className="rounded bg-amber-100/80 px-1 py-0.5 font-mono text-xs">.env.example</code>{' '}
            to{' '}
            <code className="rounded bg-amber-100/80 px-1 py-0.5 font-mono text-xs">.env</code> and
            follow these steps:
          </p>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {checks.map((c) => (
          <li
            key={c.label}
            className="flex items-center gap-2.5 rounded-xl bg-white/60 px-3 py-2 text-sm"
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                c.ready ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}
            >
              {c.icon}
            </span>
            <span className="font-medium text-amber-900">{c.label}:</span>
            <span className="text-amber-800">{c.detail}</span>
          </li>
        ))}
      </ul>
      {!checks[0].ready ? (
        <p className="mt-3 text-sm text-amber-900">
          Quick start:{' '}
          <code className="rounded bg-amber-100/80 px-1 py-0.5 font-mono text-xs">
            docker compose up -d
          </code>{' '}
          then{' '}
          <code className="rounded bg-amber-100/80 px-1 py-0.5 font-mono text-xs">
            npm run db:push
          </code>
          .
        </p>
      ) : null}
      <Link
        href="/assistant"
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-900 underline underline-offset-2 transition-colors hover:text-amber-700"
      >
        Open the AI Assistant →
      </Link>
    </div>
  )
}