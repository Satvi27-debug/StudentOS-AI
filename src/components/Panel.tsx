export function Panel({
  title,
  action,
  children,
  className = '',
}: {
  title?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`rounded-lg border border-zinc-200 bg-white ${className}`}>
      {title ? (
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3">
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
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    zinc: 'bg-zinc-300',
  }
  return <span className={`inline-block h-2 w-2 rounded-full ${map[color]}`} />
}