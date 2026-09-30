'use client'

import { useStudent } from '@/lib/local/store'

function greeting(hour: number) {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function HomePage() {
  const { state, loading, error } = useStudent()

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-sm text-zinc-400">Loading…</p>
      </div>
    )
  }

  if (error || !state) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-sm text-rose-500">{error ?? 'Failed to load data'}</p>
      </div>
    )
  }

  const firstName = state.student.name && state.student.name !== 'Student'
    ? state.student.name.split(' ')[0]
    : ''

  const hour = new Date().getHours()

  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center text-center animate-fade-in-up">
      <p className="text-sm font-medium text-zinc-400">
        {greeting(hour)} ·{' '}
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      </p>
      <h1 className="mt-4 text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
        {firstName ? (
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            {firstName}
          </span>
        ) : (
          'Welcome'
        )}
      </h1>
      <p className="mt-4 text-xl text-zinc-500 sm:text-2xl">
        Welcome to <span className="font-semibold text-zinc-700">StudentOS AI</span>
      </p>
      <div className="mt-8 flex items-center gap-2 text-sm text-zinc-400">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
        All systems local · no cloud · your data stays yours
      </div>
    </section>
  )
}