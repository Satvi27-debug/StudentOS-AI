/** Local date key YYYY-MM-DD for grouping/comparison. */
export function dateKey(d: Date | string | null | undefined): string | null {
  if (!d) return null
  const date = typeof d === 'string' ? new Date(d) : d
  if (Number.isNaN(date.getTime())) return null
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayKey(): string {
  return dateKey(new Date())!
}

export function parseDateInput(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return Number.isNaN(date.getTime()) ? null : date
}

/** "Oct 5, 2026" — compact, readable formatting for lists. */
export function formatDate(d: Date | string | null | undefined): string {
  if (d) {
    // 'YYYY-MM-DD' keys parse as UTC otherwise — parse parts locally.
    const m =
      typeof d === 'string' ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(d) : null
    if (m) {
      return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    }
  }
  const date = typeof d === 'string' ? new Date(d) : d
  if (!date || Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function isOverdue(due: Date | null | undefined): boolean {
  const key = dateKey(due)
  return key !== null && key < todayKey();
}
