import type { ReactNode } from 'react'

export function StatCard({
  label,
  value,
  icon,
  accent,
  sub,
}: {
  label: string
  value: string | number
  icon: ReactNode
  accent: string
  sub?: string
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.05),0_12px_28px_rgba(0,0,0,0.08)]">
      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${accent}`}>
        {icon}
      </span>
      <p className="mt-2.5 text-2xl font-bold text-zinc-900">{value}</p>
      <p className="text-xs text-zinc-500">{label}</p>
      {sub ? <p className="mt-0.5 text-[11px] text-zinc-400">{sub}</p> : null}
    </div>
  )
}

export function ProgressBar({
  label,
  value,
  max,
  color = 'from-indigo-500 to-violet-500',
}: {
  label: string
  value: number
  max: number
  color?: string
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-zinc-600">{label}</span>
        <span className="font-bold text-zinc-800">
          {value}/{max} · {pct}%
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-[width] duration-700 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}