export function Panel({
  title,
  action,
  children,
  className = '',
  hover = false,
}: {
  title?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <section
      className={`rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] ${className} ${
        hover ? 'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.05),0_12px_28px_rgba(0,0,0,0.08)]' : ''
      }`}
    >
      {title ? (
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3.5">
          <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
          {action}
        </div>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <p className="text-sm font-medium text-zinc-900">{title}</p>
      <p className="text-sm text-zinc-500">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}

export function StatusDot({ color }: { color: 'green' | 'amber' | 'red' | 'zinc' }) {
  const map = {
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-rose-500',
    zinc: 'bg-zinc-300',
  }
  return <span className={`inline-block h-2 w-2 rounded-full ${map[color]}`} />
}